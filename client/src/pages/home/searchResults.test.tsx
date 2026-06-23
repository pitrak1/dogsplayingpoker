import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/wrapper'
import { SearchResults } from './searchResults'
import { makeUsers } from '@/test/factories'
import { userEvent } from '@testing-library/user-event/dist/cjs/setup/index.js'
import * as reactRouter from 'react-router'

describe('SearchResults', () => {
  it('shows no results when no results are found', () => {
    renderWithProviders(<SearchResults users={[]} onSearchResultHover={vi.fn()} />)
    expect(screen.getByText(/no pets found/i)).toBeInTheDocument()
  })

  it('shows a list of users when results are found', () => {
    const users = makeUsers(5)
    renderWithProviders(<SearchResults users={users} onSearchResultHover={vi.fn()} />)
    expect(screen.getAllByRole('button')).toHaveLength(5)
  })

  it('calls onSearchResultHover when a result is hovered', async () => {
    const users = makeUsers(5)
    const onSearchResultHover = vi.fn()
    renderWithProviders(<SearchResults users={users} onSearchResultHover={onSearchResultHover} />)
    const buttons = screen.getAllByRole('button')
    await userEvent.hover(buttons[0])
    expect(onSearchResultHover).toHaveBeenCalledWith(users[0])
  })

  it('calls onSearchResultHover with null when a result is not hovered', async () => {
    const users = makeUsers(5)
    const onSearchResultHover = vi.fn()
    renderWithProviders(<SearchResults users={users} onSearchResultHover={onSearchResultHover} />)
    const buttons = screen.getAllByRole('button')
    await userEvent.hover(buttons[0])
    await userEvent.unhover(buttons[0])
    expect(onSearchResultHover).toHaveBeenCalledWith(null)
  })

  it('navigates to user profile when a result is clicked', async () => {
    const mockNavigate = vi.fn()
    vi.spyOn(reactRouter, 'useNavigate').mockReturnValue(mockNavigate)

    const users = makeUsers(5)
    renderWithProviders(<SearchResults users={users} onSearchResultHover={vi.fn()} />)
    const buttons = screen.getAllByRole('button')
    await userEvent.click(buttons[3])
    expect(mockNavigate).toHaveBeenCalledWith(`/profile/${users[3].username}`)
  })
})