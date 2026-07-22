import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fireEvent, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProfileEditLocation } from './profileEditLocation'
import { ApiError } from '@/api/errors'
import * as usersApi from '@/api/users'
import * as authContext from '@/context/auth'
import { renderWithProviders } from '@/test/wrapper'
import { mockAuthContext } from '@/test/mocks'
import { makeUser } from '@/test/factories'

const testUser = makeUser()

const mockUpdateProfile = (success = true) => {
  const mockMutate = success
    ? vi.fn().mockResolvedValue(testUser)
    : vi.fn().mockRejectedValue(new ApiError('Invalid credentials'))
  vi.spyOn(usersApi, 'useUpdateProfile').mockReturnValue({
    mutateAsync: mockMutate,
    isPending: false,
    error: null,
  } as any)

  const mockSetAuthUser = vi.fn()
  vi.spyOn(authContext, 'setAuthUser').mockImplementation(mockSetAuthUser)

  return { mockMutate, mockSetAuthUser }
}

describe('profileEditLocation', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    mockAuthContext()
  })

  it('generate button is disabled if coordinates are not set', () => {
    renderWithProviders(<ProfileEditLocation />)
    expect(screen.getByRole('button', { name: /generate/i })).toBeDisabled()
  })

  it('form starts with distance set to 0', async () => {
    renderWithProviders(<ProfileEditLocation />)
    expect(screen.getByRole('slider')).toHaveValue("0")
  })

  it('generate button is enabled if coordinates and distance are set', async () => {
    renderWithProviders(<ProfileEditLocation />)
    await userEvent.click(screen.getByTestId('trigger-retrieve'))
    await fireEvent.change(screen.getByRole('slider'), { target: { value: '7' } })
    expect(screen.getByRole('button', { name: /generate/i })).not.toBeDisabled()
  })

  it('save button is disabled when no coordinates have been generated', async () => {
    renderWithProviders(<ProfileEditLocation />)
    await userEvent.click(screen.getByTestId('trigger-retrieve'))
    await fireEvent.change(screen.getByRole('slider'), { target: { value: '7' } })
    expect(screen.getByRole('button', { name: /save/i })).toBeDisabled()
  })

  it('save button is enabled when coordinates have been generated', async () => {
    renderWithProviders(<ProfileEditLocation />)
    await userEvent.click(screen.getByTestId('trigger-retrieve'))
    await fireEvent.change(screen.getByRole('slider'), { target: { value: '7' } })
    await userEvent.click(screen.getByRole('button', { name: /generate/i }))
    expect(screen.getByRole('button', { name: /save/i })).not.toBeDisabled()
  })

  it('clicking save button updates user profile', async () => {
    const { mockMutate } = mockUpdateProfile()
    renderWithProviders(<ProfileEditLocation />)
    await userEvent.click(screen.getByTestId('trigger-retrieve'))
    await fireEvent.change(screen.getByRole('slider'), { target: { value: '7' } })
    await userEvent.click(screen.getByRole('button', { name: /generate/i }))
    await userEvent.click(screen.getByRole('button', { name: /save/i }))
    expect(mockMutate).toHaveBeenCalledWith(expect.objectContaining({
      location: {
        x: expect.any(Number),
        y: expect.any(Number)
      },
      radiusMiles: expect.any(Number) 
    }))
  })

  it('clicking save button updates authenticated user', async () => {
    const { mockSetAuthUser } = mockUpdateProfile()
    renderWithProviders(<ProfileEditLocation />)
    await userEvent.click(screen.getByTestId('trigger-retrieve'))
    await fireEvent.change(screen.getByRole('slider'), { target: { value: '7' } })
    await userEvent.click(screen.getByRole('button', { name: /generate/i }))
    await userEvent.click(screen.getByRole('button', { name: /save/i }))
    expect(mockSetAuthUser).toHaveBeenCalledWith(testUser)
  })

  it('error on save is displayed', async () => {
    mockUpdateProfile(false)
    renderWithProviders(<ProfileEditLocation />)
    await userEvent.click(screen.getByTestId('trigger-retrieve'))
    await fireEvent.change(screen.getByRole('slider'), { target: { value: '7' } })
    await userEvent.click(screen.getByRole('button', { name: /generate/i }))
    await userEvent.click(screen.getByRole('button', { name: /save/i }))
    expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
  })

  it('clicking clear button updates user profile', async () => {
    const { mockMutate } = mockUpdateProfile()
    renderWithProviders(<ProfileEditLocation />)
    await userEvent.click(screen.getByRole('button', { name: /clear/i }))
    expect(mockMutate).toHaveBeenCalledWith({ 
      location: null,
      radiusMiles: null
    })
  })

  it('clicking clear button updates authenticated user', async () => {
    const { mockSetAuthUser } = mockUpdateProfile()
    renderWithProviders(<ProfileEditLocation />)
    await userEvent.click(screen.getByRole('button', { name: /clear/i }))
    expect(mockSetAuthUser).toHaveBeenCalledWith(testUser)
  })

  it('error on clear is displayed', async () => {
    mockUpdateProfile(false)
    renderWithProviders(<ProfileEditLocation />)
    await userEvent.click(screen.getByRole('button', { name: /clear/i }))
    expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
  })
})