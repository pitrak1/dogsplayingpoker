import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { Header } from '@/components/header/header'
import { renderWithProviders } from '@/test/wrapper'

describe('header', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('shows return home if on /login', async () => {
    renderWithProviders(<Header />, '/login')
    expect(await screen.findByText(/back to home/i)).toBeInTheDocument()
  })

  it('shows return home if on /signup', async () => {
    renderWithProviders(<Header />, '/signup')
    expect(await screen.findByText(/back to home/i)).toBeInTheDocument()
  })

  it('shows user menu if not on auth page', async () => {
    // user is not authenticated, so it should show the login and signup options
    renderWithProviders(<Header />)
    expect(await screen.findByText(/log in/i)).toBeInTheDocument()
    expect(await screen.findByText(/sign up/i)).toBeInTheDocument()
  })
})