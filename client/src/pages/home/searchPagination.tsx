import { ChevronLeft, ChevronRight } from 'lucide-react'
import './searchPagination.scss'

type Props = {
  pageNumber: number
  totalCount: number | null
  onPageChange: (value: number) => void
}

export function SearchPagination({ pageNumber, totalCount, onPageChange }: Props) {
  const pageSize = 25
  if (totalCount == null || totalCount === 0 || totalCount <= pageSize
  ) return null
  const totalPages = Math.ceil(totalCount / pageSize)
  const prevDisabled = pageNumber <= 1
  const nextDisabled = pageNumber >= totalPages

  const pageButtonNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    } else if (pageNumber <= 3) {
      return [1, 2, 3, 4, 5]
    } else if (pageNumber >= totalPages - 2) {
      return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
    } else {
      return [pageNumber - 2, pageNumber - 1, pageNumber, pageNumber + 1, pageNumber + 2]
    }
  }

  const pageButtons = pageButtonNumbers().map((num) => {
    const isActivePage = num === pageNumber
    return (
      <button
        key={num}
        className={`search-pagination__page-button${isActivePage ? '-active' : ''}`}
        disabled={isActivePage}
        onClick={() => onPageChange(num)}
      >
        {num}
      </button>
    )
  })

  return (
    <div className="search-pagination">
      <button
        className="search-pagination__nav-button"
        disabled={prevDisabled}
        onClick={() => onPageChange(pageNumber - 1)}
      >
        <ChevronLeft />
        Prev
      </button>
      <div className="search-pagination__page-buttons">{pageButtons}</div>
      <button
        className="search-pagination__nav-button"
        disabled={nextDisabled}
        onClick={() => onPageChange(pageNumber + 1)}
      >
        Next
        <ChevronRight />
      </button>
    </div>
  )
}
