import './searchPagination.scss'

type Props = {
    pageNumber: number
    totalPages: number
    onPageChange: (value: number) => void
}

export function SearchPagination({ pageNumber, totalPages, onPageChange }: Props) {
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

    const onPageClick = (num: number) => {
        console.log(num)
    }

    const pageButtons = pageButtonNumbers().map((num) => {
        const isActivePage = num === pageNumber
        return (
            <button
                key={num}
                className={`search-pagination__page-button${isActivePage ? '-active' : ''}`}
                disabled={isActivePage}
                onClick={() => onPageClick(num)}
            >
                {num}
            </button>
        )
    })

    return (
        <div className="search-pagination">
            <button className="search-pagination__nav-button" disabled={prevDisabled} onClick={() => onPageChange(pageNumber - 1)}>
                <svg className="search-pagination__nav-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                </svg>
                Prev
            </button>
            <div className="search-pagination__page-buttons">
                {pageButtons}
            </div>
            <button className="search-pagination__nav-button" disabled={nextDisabled} onClick={() => onPageChange(pageNumber + 1)}>
                Next
                <svg className="search-pagination__nav-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                </svg>
            </button>
        </div>
    )
}
