'use client'
import { Button } from '@/app/_components/ui/button'
import { Table } from '@tanstack/react-table'
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs'

interface PaginationActions {
  totalRows: number
  nextPage: () => void
  prePage: () => void
  firstPage?: (() => void) | undefined
  lastPage?: (() => void) | undefined
  setPage: (page: number) => void
}

interface DataTablePaginationProps<TData> {
  table: Table<TData>
  actions: PaginationActions
  currentPage: number
  showFirstLastButtons?: boolean
  maxVisiblePages?: number
}

export function DataTablePagination<TData>({
  table,
  actions,
  currentPage,
  showFirstLastButtons = false,
  maxVisiblePages = 1,
}: DataTablePaginationProps<TData>) {
  const { totalRows, setPage, nextPage, prePage, firstPage, lastPage } = actions

  const getPageNumbers = () => {
    if (totalRows <= 1) return []

    const pages: (number | string)[] = [1] // Always include first page

    let startPage = Math.max(2, currentPage - maxVisiblePages)
    let endPage = Math.min(totalRows - 1, currentPage + maxVisiblePages)

    // Adjust if we're at the beginning or end
    if (currentPage <= maxVisiblePages + 1) {
      endPage = Math.min(1 + maxVisiblePages * 2, totalRows - 1)
    }
    if (currentPage >= totalRows - maxVisiblePages) {
      startPage = Math.max(2, totalRows - maxVisiblePages * 2)
    }

    // Add ellipsis if there's a gap between first page and startPage
    if (startPage > 2) {
      pages.push('...')
    }

    // Add visible page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    // Add ellipsis if there's a gap between endPage and last page
    if (endPage < totalRows - 1) {
      pages.push('...')
    }

    // Always include last page if there's more than 1 page
    if (totalRows > 1) {
      pages.push(totalRows)
    }

    return pages
  }

  return (
    <div className="mt-4 flex items-center justify-center px-2 pb-4">
      {table.getFilteredRowModel() && (
        <div className="flex items-center gap-1">
          {showFirstLastButtons && firstPage && (
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 text-neutral-700"
              onClick={firstPage}
              disabled={currentPage === 1}
            >
              <span className="sr-only">Go to first page</span>
              <BsArrowLeft className="h-5 w-5" viewBox="0 0 20 20" />
              <BsArrowLeft className="-ml-2 h-5 w-5" viewBox="0 0 20 20" />
            </Button>
          )}

          <Button
            variant="ghost"
            className="h-8 w-8 p-0 text-neutral-700"
            onClick={prePage}
            disabled={currentPage === 1}
          >
            <span className="sr-only">Go to previous page</span>
            <BsArrowLeft className="h-5 w-5" viewBox="0 0 20 20" />
          </Button>

          {getPageNumbers().map((page, index) => (
            <Button
              key={index}
              variant={page === currentPage ? 'secondary' : 'ghost'}
              className="h-8 w-8 min-w-[32px] p-0 text-neutral-700"
              onClick={() => typeof page === 'number' && setPage(page)}
              disabled={page === '...'}
            >
              {page}
            </Button>
          ))}

          <Button
            variant="ghost"
            className="h-8 w-8 p-0 text-neutral-700"
            onClick={nextPage}
            disabled={currentPage === totalRows}
          >
            <span className="sr-only">Go to next page</span>
            <BsArrowRight className="h-5 w-5" viewBox="0 0 20 20" />
          </Button>

          {showFirstLastButtons && lastPage && (
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 text-neutral-700"
              onClick={lastPage}
              disabled={currentPage === totalRows}
            >
              <span className="sr-only">Go to last page</span>
              <BsArrowRight className="h-5 w-5" viewBox="0 0 20 20" />
              <BsArrowRight className="-ml-2 h-5 w-5" viewBox="0 0 20 20" />
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
