import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { Header } from '@/components/header/header'
import { renderWithProviders } from '@/test/wrapper'
import { mockAuthContext } from '@/test/mocks'

describe('header', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('shows return home if on /login', async () => {
    renderWithProviders(<Header />, '/login')
    expect(await screen.findByText(/return home/i)).toBeInTheDocument()
  })

  it('shows return home if on /signup', async () => {
    renderWithProviders(<Header />, '/signup')
    expect(await screen.findByText(/return home/i)).toBeInTheDocument()
  })

  it('shows user menu if not on auth page and logged in', async () => {
    const { user } = mockAuthContext()
    renderWithProviders(<Header />)
    expect(await screen.findByText(user.username)).toBeInTheDocument()
  })

  it('shows auth buttons if not on auth page and not logged in', async () => {
    renderWithProviders(<Header />)
    expect(await screen.findByText(/log in/i)).toBeInTheDocument()
    expect(await screen.findByText(/sign up/i)).toBeInTheDocument()
  })
})