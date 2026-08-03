import { describe, it, expect, vi, beforeEach } from 'vitest'
import { act, screen } from '@testing-library/react'
import { UserMenu } from '@/components/header/userMenu'
import { renderWithProviders } from '@/test/wrapper'
import { mockAuthContext } from '@/test/mocks'

describe('userMenu', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('clicking on log out clears authentication', async () => {
    const { user, clearAuth } = mockAuthContext()
    renderWithProviders(<UserMenu />)

    const username = await screen.findByText(user.username)
    act(() => username.click())

    const logOutLink = await screen.findByText(/log out/i)
    act(() => logOutLink.click())

    expect(clearAuth).toHaveBeenCalled()
  })
})