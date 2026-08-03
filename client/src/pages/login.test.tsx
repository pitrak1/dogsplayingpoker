import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Login } from './login'
import { ApiError } from '@/api/errors'
import * as usersApi from '@/api/users'
import * as reactRouter from 'react-router'
import { renderWithProviders } from '@/test/wrapper'

const getInput = (name: string) => document.querySelector(`input[name="${name}"]`) as HTMLElement

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

  it('calls login with the entered credentials', async () => {
    const { mockMutate } = setupHooks()
    renderWithProviders(<Login />)
    await userEvent.type(screen.getByLabelText(/email/i), 'sarah@example.com')
    await userEvent.type(getInput('password'), 'password123')
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
    await userEvent.type(getInput('password'), 'password123')
    await userEvent.click(screen.getByRole('button', { name: /log in/i }))

    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true })
  })

  it('shows error message when login fails', async () => {
    setupHooks(false)

    renderWithProviders(<Login />)
    await userEvent.type(screen.getByLabelText(/email/i), 'sarah@example.com')
    await userEvent.type(getInput('password'), 'password123')
    await userEvent.click(screen.getByRole('button', { name: /log in/i }))

    expect(await screen.findByText('Invalid credentials')).toBeInTheDocument()
  })
})