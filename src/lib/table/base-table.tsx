'use client'

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/_components/ui/table'
import { PAGE_SIZE } from '@/configs/global'
import { DataTablePagination } from '@/lib/table/pagination'

interface BaseTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  actions: {
    totalRows: number
    nextPage: () => void
    prePage: () => void
    firstPage?: (() => void) | undefined
    lastPage?: (() => void) | undefined
    setPage: (page: number) => void
  }
  currentPage: number
  pageSize?: number
  showFirstLastButtons?: boolean
}

export function BaseTable<TData, TValue>({
  columns,
  data,
  actions,
  currentPage,
  pageSize = Number(PAGE_SIZE || 10),
  showFirstLastButtons = false,
}: BaseTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize,
        pageIndex: currentPage - 1,
      },
    },
    // Disable built-in pagination controls since we're using custom ones
    manualPagination: true,
    state: {
      pagination: {
        pageSize,
        pageIndex: currentPage - 1,
      },
    },
  })

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-md">
        <Table className="rounded-lg">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-center">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {actions.totalRows > 1 && (
        <DataTablePagination
          table={table}
          actions={{
            totalRows: actions.totalRows,
            nextPage: actions.nextPage,
            prePage: actions.prePage,
            firstPage: actions.firstPage,
            lastPage: actions.lastPage,
            setPage: actions.setPage,
          }}
          currentPage={currentPage}
          showFirstLastButtons={showFirstLastButtons}
        />
      )}
    </div>
  )
}
