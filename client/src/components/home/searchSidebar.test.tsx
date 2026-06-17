import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/wrapper'
import { SearchSidebar } from './searchSidebar'
import { userEvent } from '@testing-library/user-event/dist/cjs/setup/index.js'

vi.mock('@mapbox/search-js-react', () => ({
  SearchBox: ({ value, onChange, onRetrieve }: any) => (
    <div>
      <input
        data-testid="search-box"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        data-testid="trigger-retrieve"
        onClick={() =>
          onRetrieve({ features: [{ properties: { name: 'Test Location' } }] })
        }
      >
        retrieve
      </button>
    </div>
  ),
}))

const baseProps = {
  users: [],
  totalCount: 0,
  mapInstance: null,
  searchValue: '',
  currentPage: 1,
  onPageChange: vi.fn(),
  onSearchChange: vi.fn(),
  searchedLocation: null,
  onSearchLocationChange: vi.fn(),
  onSearchResultHover: vi.fn(),
}

describe('SearchSidebar', () => {
  it('shows "Search for a location" label when no location is set', () => {
    renderWithProviders(<SearchSidebar {...baseProps} />)
    expect(screen.getByRole('heading')).toHaveTextContent('Search for a location')
  })

  it('shows "Searching near" label when a location is set', () => {
    renderWithProviders(<SearchSidebar {...baseProps} searchedLocation="Chicago" />)
    expect(screen.getByRole('heading')).toHaveTextContent('Searching near')
  })

  it('displays the total user count', () => {
    renderWithProviders(<SearchSidebar {...baseProps} totalCount={42} />)
    expect(screen.getByText(/42 total users/i)).toBeInTheDocument()
  })

  // it('calls onSearchLocationChange when a result is retrieved', async () => {
  //   const onSearchLocationChange = vi.fn()
  //   renderWithProviders(
  //     <SearchSidebar {...baseProps} onSearchLocationChange={onSearchLocationChange} />
  //   )
  //   await userEvent.click(screen.getByTestId('trigger-retrieve'))
  //   expect(onSearchLocationChange).toHaveBeenCalledWith('Test Location')
  // })
})