import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Login } from './login'
import { ApiError } from '@/api/errors'
import * as usersApi from '@/api/users'
import * as reactRouter from 'react-router'
import { renderWithProviders } from '@/test/wrapper'

const setupHooks = (loginResolved = true) => {
  const mockMutate = loginResolved
    ? vi.fn().mockResolvedValue({ authToken: 'tok', user: { id: 1, username: 'sarah' } })
    : vi.fn().mockRejectedValue(new ApiError('Invalid credentials'))
  vi.spyOn(usersApi, 'useLogin').mockReturnValue({
    mutateAsync: mockMutate,
    isPending: false,
    error: null,
  } as any)

  const mockNavigate = vi.fn()
  vi.spyOn(reactRouter, 'useNavigate').mockReturnValue(mockNavigate)

  return { mockMutate, mockNavigate }
}

describe('login', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('starts with empty form', () => {
    renderWithProviders(<Login />)
    expect(screen.getByLabelText(/email/i)).toHaveValue('')
    expect(screen.getByLabelText(/password/i)).toHaveValue('')
  })

  it('submit is disabled without email', async () => {
    renderWithProviders(<Login />)
    await userEvent.type(screen.getByLabelText(/password/i), 'password123')
    expect(screen.getByRole('button', { name: /log in/i })).toBeDisabled()
  })

  it('submit is disabled without password', async () => {
    renderWithProviders(<Login />)
    await userEvent.type(screen.getByLabelText(/email/i), 'user@example.com')
    expect(screen.getByRole('button', { name: /log in/i })).toBeDisabled()
  })

  it('submit is enabled with email and password', async () => {
    renderWithProviders(<Login />)
    await userEvent.type(screen.getByLabelText(/email/i), 'user@example.com')
    await userEvent.type(screen.getByLabelText(/password/i), 'password123')
    expect(screen.getByRole('button', { name: /log in/i })).not.toBeDisabled()
  })

  it('calls login with the entered credentials', async () => {
    const { mockMutate } = setupHooks()
    renderWithProviders(<Login />)
    await userEvent.type(screen.getByLabelText(/email/i), 'sarah@example.com')
    await userEvent.type(screen.getByLabelText(/password/i), 'password123')
    await userEvent.click(screen.getByRole('button', { name: /log in/i }))

    expect(mockMutate).toHaveBeenCalledWith({
      email: 'sarah@example.com',
      password: 'password123',
    })
  })

  it('navigates to home on success', async () => {
    const { mockNavigate } = setupHooks()

    renderWithProviders(<Login />)
    await userEvent.type(screen.getByLabelText(/email/i), 'sarah2@example.com')
    await userEvent.type(screen.getByLabelText(/password/i), 'password123')
    await userEvent.click(screen.getByRole('button', { name: /log in/i }))

    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true })
  })

  it('shows error message when login fails', async () => {
    setupHooks(false)

    renderWithProviders(<Login />)
    await userEvent.type(screen.getByLabelText(/email/i), 'sarah@example.com')
    await userEvent.type(screen.getByLabelText(/password/i), 'password123')
    await userEvent.click(screen.getByRole('button', { name: /log in/i }))

    expect(await screen.findByText('Invalid credentials')).toBeInTheDocument()
  })
})