import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/wrapper'
import { Signup } from './signup'
import { ApiError } from '@/api/errors'
import * as usersApi from '@/api/users'
import * as reactRouter from 'react-router'

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

  it('starts with empty form', () => {
    renderWithProviders(<Signup />)
    expect(screen.getByLabelText(/email/i)).toHaveValue('')
    expect(screen.getByLabelText(/username/i)).toHaveValue('')
    expect(screen.getByLabelText(/^password$/i)).toHaveValue('')
    expect(screen.getByLabelText(/confirm password/i)).toHaveValue('')
  })

  const fillFields = async (fields: Partial<{ email: string; username: string; password: string; confirmPassword: string }>) => {
    if (fields.email) await userEvent.type(screen.getByLabelText(/email/i), fields.email)
    if (fields.username) await userEvent.type(screen.getByLabelText(/username/i), fields.username)
    if (fields.password) await userEvent.type(screen.getByLabelText(/^password$/i), fields.password)
    if (fields.confirmPassword) await userEvent.type(screen.getByLabelText(/confirm password/i), fields.confirmPassword)
  }

  it.each([
    ['email', { username: 'sarah', password: 'password123', confirmPassword: 'password123' }],
    ['username', { email: 'user@example.com', password: 'password123', confirmPassword: 'password123' }],
    ['password', { email: 'user@example.com', username: 'sarah', confirmPassword: 'password123' }],
    ['confirmPassword', { email: 'user@example.com', username: 'sarah', password: 'password123' }]
  ])('submit is disabled without %s', async (_, fields) => {
    renderWithProviders(<Signup />)
    await fillFields(fields)
    expect(screen.getByRole('button', { name: /sign up/i })).toBeDisabled()
  })

  it('submit is disabled when password and confirm password do not match', async () => {
    renderWithProviders(<Signup />)
    await userEvent.type(screen.getByLabelText(/email/i), 'user@example.com')
    await userEvent.type(screen.getByLabelText(/username/i), 'sarah')
    await userEvent.type(screen.getByLabelText(/^password$/i), 'password123')
    await userEvent.type(screen.getByLabelText(/confirm password/i), 'differentpassword')
    expect(screen.getByRole('button', { name: /sign up/i })).toBeDisabled()
  })

  it('password mismatch error is displayed when password and confirm password do not match', async () => {
    renderWithProviders(<Signup />)
    await userEvent.type(screen.getByLabelText(/email/i), 'user@example.com')
    await userEvent.type(screen.getByLabelText(/username/i), 'sarah')
    await userEvent.type(screen.getByLabelText(/^password$/i), 'password123')
    await userEvent.type(screen.getByLabelText(/confirm password/i), 'differentpassword')
    
    const formField = screen.getByLabelText('Confirm Password').closest('.form-field') as HTMLElement
    expect(within(formField).getByText(/passwords do not match/i)).toBeInTheDocument()
  })

  it('submit is enabled when all fields are valid', async () => {
    renderWithProviders(<Signup />)
    await fillFields({ email: 'sarah@example.com', username: 'sarah', password: 'password123', confirmPassword: 'password123' })
    expect(screen.getByRole('button', { name: /sign up/i })).not.toBeDisabled()
  })

  it('calls createUser with the entered credentials', async () => {
    const { mockMutate } = setupHooks()
    renderWithProviders(<Signup />)
    await userEvent.type(screen.getByLabelText(/email/i), 'sarah@example.com')
    await userEvent.type(screen.getByLabelText(/username/i), 'sarah')
    await userEvent.type(screen.getByLabelText(/^password$/i), 'password123')
    await userEvent.type(screen.getByLabelText(/confirm password/i), 'password123')
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
    await userEvent.type(screen.getByLabelText(/^password$/i), 'password123')
    await userEvent.type(screen.getByLabelText(/confirm password/i), 'password123')
    await userEvent.click(screen.getByRole('button', { name: /sign up/i }))

    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true })
  })

  it('shows email error message when email is not unique', async () => {
    setupHooks('uniqueness', 'email')

    renderWithProviders(<Signup />)
    await userEvent.type(screen.getByLabelText(/email/i), 'sarah@example.com')
    await userEvent.type(screen.getByLabelText(/username/i), 'sarah')
    await userEvent.type(screen.getByLabelText(/^password$/i), 'password123')
    await userEvent.type(screen.getByLabelText(/confirm password/i), 'password123')
    await userEvent.click(screen.getByRole('button', { name: /sign up/i }))

    const formField = screen.getByLabelText('Email').closest('.form-field') as HTMLElement
    expect(within(formField).getByText(/email is already in use/i)).toBeInTheDocument()
  })

  it('shows username error message when username is not unique', async () => {
    setupHooks('uniqueness', 'username')

    renderWithProviders(<Signup />)
    await userEvent.type(screen.getByLabelText(/email/i), 'sarah@example.com')
    await userEvent.type(screen.getByLabelText(/username/i), 'sarah')
    await userEvent.type(screen.getByLabelText(/^password$/i), 'password123')
    await userEvent.type(screen.getByLabelText(/confirm password/i), 'password123')
    await userEvent.click(screen.getByRole('button', { name: /sign up/i }))

    const formField = screen.getByLabelText('Username').closest('.form-field') as HTMLElement
    expect(within(formField).getByText(/username is already in use/i)).toBeInTheDocument()
  })

  it('shows form error message when submission fails', async () => {
    setupHooks('some error')

    renderWithProviders(<Signup />)
    await userEvent.type(screen.getByLabelText(/email/i), 'sarah@example.com')
    await userEvent.type(screen.getByLabelText(/username/i), 'sarah')
    await userEvent.type(screen.getByLabelText(/^password$/i), 'password123')
    await userEvent.type(screen.getByLabelText(/confirm password/i), 'password123')
    await userEvent.click(screen.getByRole('button', { name: /sign up/i }))

    expect(screen.getByText(/some error/i)).toBeInTheDocument()
  })
})