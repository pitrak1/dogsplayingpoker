import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/wrapper'
import { Signup } from './signup'
import { ApiError } from '@/api/errors'
import * as usersApi from '@/api/users'
import * as reactRouter from 'react-router'

const getInput = (name: string) => document.querySelector(`input[name="${name}"]`) as HTMLElement

const setupHooks = (error: string | null = null, field: string | null = null) => {
  let mockMutate: ReturnType<typeof vi.fn>
  if (field === 'email') {
    mockMutate = vi.fn().mockRejectedValue(new ApiError('That email is already in use', 'email'))
  } else if (field === 'username') {
    mockMutate = vi.fn().mockRejectedValue(new ApiError('That username is already in use', 'username'))
  } else if (error) {
    mockMutate = vi.fn().mockRejectedValue(new ApiError(error))
  } else {
    mockMutate = vi.fn().mockResolvedValue({ authToken: 'tok', user: { id: 1, username: 'sarah' } })
  }
  vi.spyOn(usersApi, 'useRegister').mockReturnValue({
    mutateAsync: mockMutate,
    isPending: false,
    error: null,
  } as any)

  const mockNavigate = vi.fn()
  vi.spyOn(reactRouter, 'useNavigate').mockReturnValue(mockNavigate)

  return { mockMutate, mockNavigate }
}

describe('signup', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('calls createUser with the entered credentials', async () => {
    const { mockMutate } = setupHooks()
    renderWithProviders(<Signup />)
    await userEvent.type(screen.getByLabelText(/email/i), 'sarah@example.com')
    await userEvent.type(screen.getByLabelText(/username/i), 'sarah')
    await userEvent.type(getInput('password'), 'password123')
    await userEvent.type(getInput('confirmPassword'), 'password123')
    await userEvent.click(screen.getByRole('button', { name: /sign up/i }))

    expect(mockMutate).toHaveBeenCalledWith({
      username: 'sarah',
      email: 'sarah@example.com',
      password: 'password123',
    })
  })

  it('navigates to home on success', async () => {
    const { mockNavigate } = setupHooks()

    renderWithProviders(<Signup />)
    await userEvent.type(screen.getByLabelText(/email/i), 'sarah@example.com')
    await userEvent.type(screen.getByLabelText(/username/i), 'sarah')
    await userEvent.type(getInput('password'), 'password123')
    await userEvent.type(getInput('confirmPassword'), 'password123')
    await userEvent.click(screen.getByRole('button', { name: /sign up/i }))

    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true })
  })

  it('shows email error message when email is not unique', async () => {
    setupHooks('uniqueness', 'email')

    renderWithProviders(<Signup />)
    await userEvent.type(screen.getByLabelText(/email/i), 'sarah@example.com')
    await userEvent.type(screen.getByLabelText(/username/i), 'sarah')
    await userEvent.type(getInput('password'), 'password123')
    await userEvent.type(getInput('confirmPassword'), 'password123')
    await userEvent.click(screen.getByRole('button', { name: /sign up/i }))

    expect(screen.getByText(/email is already in use/i)).toBeInTheDocument()
  })

  it('shows username error message when username is not unique', async () => {
    setupHooks('uniqueness', 'username')

    renderWithProviders(<Signup />)
    await userEvent.type(screen.getByLabelText(/email/i), 'sarah@example.com')
    await userEvent.type(screen.getByLabelText(/username/i), 'sarah')
    await userEvent.type(getInput('password'), 'password123')
    await userEvent.type(getInput('confirmPassword'), 'password123')
    await userEvent.click(screen.getByRole('button', { name: /sign up/i }))

    expect(screen.getByText(/username is already in use/i)).toBeInTheDocument()
  })

  it('shows form error message when submission fails', async () => {
    setupHooks('some error')

    renderWithProviders(<Signup />)
    await userEvent.type(screen.getByLabelText(/email/i), 'sarah@example.com')
    await userEvent.type(screen.getByLabelText(/username/i), 'sarah')
    await userEvent.type(getInput('password'), 'password123')
    await userEvent.type(getInput('confirmPassword'), 'password123')
    await userEvent.click(screen.getByRole('button', { name: /sign up/i }))

    expect(screen.getByText(/some error/i)).toBeInTheDocument()
  })
})