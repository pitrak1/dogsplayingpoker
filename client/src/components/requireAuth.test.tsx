import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { Routes, Route } from 'react-router'
import { renderWithProviders } from '@/test/wrapper'
import { mockAuthContext } from '@/test/mocks'
import { RequireAuth } from './requireAuth'

const renderGuarded = () =>
  renderWithProviders(
    <Routes>
      <Route path="/login" element={<div>login page</div>} />
      <Route path="/secret" element={<RequireAuth><div>secret content</div></RequireAuth>} />
    </Routes>,
    '/secret',
  )

describe('RequireAuth', () => {
  it('renders nothing while auth is still resolving', () => {
    mockAuthContext(null, false)
    renderGuarded()
    expect(screen.queryByText('secret content')).not.toBeInTheDocument()
    expect(screen.queryByText('login page')).not.toBeInTheDocument()
  })

  it('redirects to login when ready with no user', () => {
    mockAuthContext(null, true)
    renderGuarded()
    expect(screen.getByText('login page')).toBeInTheDocument()
    expect(screen.queryByText('secret content')).not.toBeInTheDocument()
  })

  it('renders children when a user is logged in', () => {
    mockAuthContext()
    renderGuarded()
    expect(screen.getByText('secret content')).toBeInTheDocument()
  })
})
