import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { ProfileEditLocationCurrent } from './profileEditLocationCurrent'
import { renderWithProviders } from '@/test/wrapper'
import { mockAuthContext } from '@/test/mocks'
import { makeUser } from '@/test/factories'

const testUserNoLocation = makeUser({ location: null, radiusMiles: null })
const testUserWithLocation = makeUser()

describe('profileEditLocationCurrent', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('clear button is disabled if user does not have a current location', () => {
    mockAuthContext(testUserNoLocation)
    renderWithProviders(<ProfileEditLocationCurrent isPending={false} onClearClick={vi.fn()} />)
    expect(screen.getByRole('button', { name: /clear/i })).toBeDisabled()
  })

  it('map is blocked if user does not have a current location', async () => {
    mockAuthContext(testUserNoLocation)
    renderWithProviders(<ProfileEditLocationCurrent isPending={false} onClearClick={vi.fn()} />)
    expect(screen.getByText(/no location set/i)).toBeInTheDocument()
  })

  it('clear button is enabled if user has a current location', () => {
    mockAuthContext(testUserWithLocation)
    renderWithProviders(<ProfileEditLocationCurrent isPending={false} onClearClick={vi.fn()} />)
    expect(screen.getByRole('button', { name: /clear/i })).not.toBeDisabled()
  })

  it('map is not blocked if user has a current location', async () => {
    mockAuthContext(testUserWithLocation)
    renderWithProviders(<ProfileEditLocationCurrent isPending={false} onClearClick={vi.fn()} />)
    expect(screen.queryByText(/no location set/i)).not.toBeInTheDocument()
  })
})