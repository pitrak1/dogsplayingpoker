import { ChevronLeft, ChevronRight } from 'lucide-react'
import './pagination.scss'

type Props = {
  pageNumber: number
  pageSize: number
  totalCount: number
  onPageChange: (value: number) => void
  className?: string | null
}

export function Pagination({ pageNumber, pageSize, totalCount, onPageChange, className }: Props) {
  const noPagination = totalCount <= pageSize
  const totalPages = Math.ceil(totalCount / pageSize)
  const prevDisabled = pageNumber <= 1
  const nextDisabled = pageNumber >= totalPages

  if (noPagination) return null

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
        className={`pagination__page-button${isActivePage ? '-active' : ''}`}
        disabled={isActivePage}
        onClick={() => onPageChange(num)}
      >
        {num}
      </button>
    )
  })

  return (
    <div className={`pagination ${className ?? ''}`}>
      <button
        className="pagination__nav-button"
        disabled={prevDisabled}
        onClick={() => onPageChange(pageNumber - 1)}
        aria-label="previous page"
      >
        <ChevronLeft size={20}/>
      </button>
      <div className="pagination__page-buttons">{pageButtons}</div>
      <button
        className="pagination__nav-button"
        disabled={nextDisabled}
        onClick={() => onPageChange(pageNumber + 1)}
        aria-label="next page"
      >
        <ChevronRight size={20}/>
      </button>
    </div>
  )
}
