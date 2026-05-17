import { SearchBox } from '@mapbox/search-js-react'
import mapboxgl from 'mapbox-gl'
import { User } from '@/types/user'
import './searchResults.scss'

type Props = {
    users: User[] | null
    pageNumber: number | null
    onPageChange: (value: number | null) => void
}

export function SearchResults({ users, pageNumber, onPageChange }: Props) {
    console.log('search results')
    return (
        <div className="search-results__container">
            <div className="search-results__list">
                <div>Fake User 1</div>
                <div>Fake User 2</div>
                <div>Fake User 3</div>
            </div>
            <div className="search-results__pagination">
                <button>Prev</button>
                <div className="search-results__page-number">
                    {pageNumber}
                </div>
                <button>Next</button>
            </div>
        </div>
    )
}
