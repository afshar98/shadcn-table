'use client'

import { PAGE_SIZE } from '@/configs/global'
import { ColumnDef } from '@tanstack/react-table'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo } from 'react'
import { BaseTable } from './base-table'

interface ApiResponse<T> {
  data: {
    rows: T[]
    count: number
  }
}
interface GlobalTableProps<TData> {
  columns: ColumnDef<TData>[]
  data: ApiResponse<TData>
  pageParamName?: string
  noDataText?: string
}

export interface TableActions {
  totalRows: number
  nextPage: () => void
  prePage: () => void
  lastPage?: () => void
  firstPage?: () => void
  setPage: (page: number) => void
}

type QueryParams = { [key: string]: string | undefined }

export default function GlobalTable<TData>({
  columns,
  data,
  pageParamName = 'page',
  noDataText = 'No data available',
}: GlobalTableProps<TData>) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const pageParam = Number(searchParams.get(pageParamName)) || 1
  const count = Number(PAGE_SIZE || 10)
  const totalRows = Math.ceil(data.data.count / count)

  const tableData = useMemo(
    () => data.data.rows.slice((pageParam - 1) * count, pageParam * count),
    [data.data.rows, pageParam, count]
  )

  const createQueryString = useCallback(
    (updates: QueryParams) => {
      const params = new URLSearchParams(searchParams)
      Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined) params.set(key, value)
      })
      return params.toString()
    },
    [searchParams]
  )

  useEffect(() => {
    if (tableData.length === 0 && pageParam > 1) {
      router.push(
        `${pathname}?${createQueryString({ [pageParamName]: `${pageParam - 1}` })}`
      )
    }
  }, [tableData, pageParam, pathname, createQueryString, pageParamName, router])
  if (tableData.length === 0 && pageParam > 1) {
    router.push(
      `${pathname}?${createQueryString({ [pageParamName]: `${pageParam - 1}` })}`
    )
    return null
  }

  const action: TableActions = {
    totalRows: totalRows,
    nextPage: () => handlePageChange(pageParam + 1),
    prePage: () => handlePageChange(pageParam - 1),
    firstPage: () => handlePageChange(1),
    lastPage: () => handlePageChange(totalRows),
    setPage: (page: number) => handlePageChange(page),
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalRows && newPage !== pageParam) {
      router.push(
        `${pathname}?${createQueryString({ [pageParamName]: `${newPage}` })}`
      )
    }
  }

  if (!data?.data?.rows) return <div className="text-center">{noDataText}</div>

  return (
    <div className="h-full overflow-y-auto">
      <BaseTable
        columns={columns}
        data={tableData}
        actions={{
          ...action,
          firstPage: action.firstPage,
          lastPage: action.lastPage,
        }}
        currentPage={pageParam}
        pageSize={count}
        showFirstLastButtons={false}
      />
    </div>
  )
}
