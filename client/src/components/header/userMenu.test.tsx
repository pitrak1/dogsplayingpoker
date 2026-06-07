import { describe, it, expect, vi, beforeEach } from 'vitest'
import { act, screen } from '@testing-library/react'
import { UserMenu } from '@/components/header/userMenu'
import { renderWithProviders } from '@/test/wrapper'
import { makeUser } from '@/test/factories'
import * as authContext from '@/context/auth'

const setupHooks = () => {
  const user = makeUser()
  const setAuth = vi.fn()
  const clearAuth = vi.fn()
  
  vi.spyOn(authContext, 'useAuth').mockReturnValue({
    user,
    setAuth,
    clearAuth
  })
  return { user, setAuth, clearAuth }
}

describe('userMenu', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('shows login/signup if not authenticated', async () => {
    renderWithProviders(<UserMenu />)
    expect(await screen.findByText(/log in/i)).toBeInTheDocument()
    expect(await screen.findByText(/sign up/i)).toBeInTheDocument()
  })

  it('shows username and profile picture if authenticated', async () => {
    const { user } = setupHooks()
    renderWithProviders(<UserMenu />)
    expect(await screen.findByText(user.username)).toBeInTheDocument()
    expect(screen.getByAltText(user.username)).toHaveAttribute('src', user.profileImageUrl)
  })

  it('clicking on username opens dropdown', async () => {
    const { user } = setupHooks()
    renderWithProviders(<UserMenu />)

    const username = await screen.findByText(user.username)
    act(() => username.click())

    expect(await screen.findByText(/your profile/i)).toBeInTheDocument()
    expect(await screen.findByText(/edit profile/i)).toBeInTheDocument()
    expect(await screen.findByText(/log out/i)).toBeInTheDocument()
  })

  it('link to profile is shown in dropdown', async () => {
    const { user } = setupHooks()
    renderWithProviders(<UserMenu />)

    const username = await screen.findByText(user.username)
    act(() => username.click())

    const profileLink = await screen.findByText(/your profile/i)
    expect(profileLink).toBeInTheDocument()
    expect(profileLink).toHaveAttribute('href', `/profile/${user.username}`) 
  })

  it('link to edit profile is shown in dropdown', async () => {
    const { user } = setupHooks()
    renderWithProviders(<UserMenu />)

    const username = await screen.findByText(user.username)
    act(() => username.click())

    const editProfileLink = await screen.findByText(/edit profile/i)
    expect(editProfileLink).toBeInTheDocument()
    expect(editProfileLink).toHaveAttribute('href', `/profile/edit`) 
  })

  it('link to log out is shown in dropdown', async () => {
    const { user } = setupHooks()
    renderWithProviders(<UserMenu />)

    const username = await screen.findByText(user.username)
    act(() => username.click())

    const logOutLink = await screen.findByText(/log out/i)
    expect(logOutLink).toBeInTheDocument()
    expect(logOutLink).toHaveAttribute('href', `/`) 
  })

  it('clicking on log out clears authentication', async () => {
    const { user, clearAuth } = setupHooks()
    renderWithProviders(<UserMenu />)

    const username = await screen.findByText(user.username)
    act(() => username.click())

    const logOutLink = await screen.findByText(/log out/i)
    act(() => logOutLink.click())

    expect(clearAuth).toHaveBeenCalled()
  })
})