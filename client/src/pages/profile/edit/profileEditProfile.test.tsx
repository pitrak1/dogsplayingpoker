import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/wrapper'
import { ProfileEditProfile } from './profileEditProfile'
import * as authContext from '@/context/auth'
import * as usersApi from '@/api/users'
import * as upload from '@/lib/upload'
import { makeUser } from '@/test/factories'
import type { UserWithPets as User } from 'dogsplayingpoker-shared/user'
import { ApiError } from '@/api/errors'

const makeFile = (name = 'avatar.png', type = 'image/png') =>
  new File(['fake content'], name, { type })

const mockAuth = (overrides?: Partial<User>) => {
  const user = makeUser(overrides)
  const setAuthUser = vi.fn()
  vi.spyOn(authContext, 'setAuthUser').mockImplementation(setAuthUser)
  vi.spyOn(authContext, 'useAuth').mockReturnValue({
    user,
    setAuth: vi.fn(),
    clearAuth: vi.fn(),
  })
  return { user, setAuthUser }
}

describe('ProfileEditProfile', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:fake-preview-url')
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(vi.fn())
  })

  it('username save button is disabled when no changes are made', async () => {
    mockAuth()
    renderWithProviders(<ProfileEditProfile />)

    const usernameField = screen.getByLabelText(/username/i).closest('div') as HTMLElement
    const saveButton = within(usernameField).getByRole('button', { name: /save/i })
    expect(saveButton).toBeDisabled()
  })

  it('username save button is enabled when changes are made', async () => {
    mockAuth()
    renderWithProviders(<ProfileEditProfile />)

    const input = screen.getByLabelText(/username/i)
    await userEvent.clear(input)
    await userEvent.type(input, 'newusername')

    const usernameField = screen.getByLabelText(/username/i).closest('div') as HTMLElement
    const saveButton = within(usernameField).getByRole('button', { name: /save/i })
    expect(saveButton).not.toBeDisabled()
  })

  it('username is saved when the save button is clicked', async () => {
    const { user } = mockAuth()
    const mockSetAuthUser = vi.fn()
    vi.spyOn(authContext, 'setAuthUser').mockImplementation(mockSetAuthUser)
    vi.spyOn(usersApi, 'useUpdateProfile').mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue({ ...user, username: 'newusername' }),
      isPending: false,
      error: null,
    } as any)
    renderWithProviders(<ProfileEditProfile />)

    const input = screen.getByLabelText(/username/i)
    await userEvent.clear(input)
    await userEvent.type(input, 'newusername')

    const usernameField = screen.getByLabelText(/username/i).closest('div') as HTMLElement
    const saveButton = within(usernameField).getByRole('button', { name: /save/i })
    await userEvent.click(saveButton)
    await waitFor(() => expect(mockSetAuthUser).toHaveBeenCalledWith({ ...user, username: 'newusername' }))
  })

  it('shows error when username is already taken', async () => {
    mockAuth()
    vi.spyOn(usersApi, 'useUpdateProfile').mockReturnValue({
      mutateAsync: vi.fn().mockRejectedValue(new ApiError('That username is already in use', 'username')),
      isPending: false,
      error: null,
    } as any)
    renderWithProviders(<ProfileEditProfile />)

    await userEvent.clear(screen.getByLabelText(/username/i))
    await userEvent.type(screen.getByLabelText(/username/i), 'taken')

    const usernameField = screen.getByLabelText(/username/i).closest('div') as HTMLElement
    const saveButton = within(usernameField).getByRole('button', { name: /save/i })
    await userEvent.click(saveButton)

    expect(await screen.findByText(/already in use/i)).toBeInTheDocument()
  })

  it('shows previews of user profile picture if present', async () => {
    mockAuth({ profileImageUrl: 'http://example.com/avatar.png' })
    renderWithProviders(<ProfileEditProfile />)

    const preview = screen.getByAltText(/profile preview/i) as HTMLImageElement
    expect(preview.src).toBe('http://example.com/avatar.png')
  })

  it('shows placeholder previews if user profile picture is not present', async () => {
    mockAuth({ profileImageUrl: null })
    renderWithProviders(<ProfileEditProfile />)

    const preview = screen.getByAltText(/profile preview/i) as HTMLImageElement
    expect(preview.src).toContain('https://ui-avatars.com')
  })

  it('shows a preview when a file is selected', async () => {
    mockAuth()
    renderWithProviders(<ProfileEditProfile />)

    const file = makeFile()
    const input = screen.getByLabelText(/upload new profile picture/i) as HTMLInputElement

    await userEvent.upload(input, file)

    const preview = screen.getByAltText(/profile preview/i) as HTMLImageElement
    expect(preview.src).toContain('blob:fake-preview-url')
  })

  it('save and revert buttons are disabled when no changes are made', async () => {
    mockAuth()
    renderWithProviders(<ProfileEditProfile />)

    const profilePictureField = screen.getByLabelText(/profile picture/i).closest('.profile-edit-profile__field') as HTMLElement
    const saveButton = within(profilePictureField).getByRole('button', { name: /save/i })
    expect(saveButton).toBeDisabled()

    const revertButton = within(profilePictureField).getByRole('button', { name: /revert/i })
    expect(revertButton).toBeDisabled()
  })

  it('save and revert buttons are enabled when a file is selected', async () => {
    mockAuth()
    renderWithProviders(<ProfileEditProfile />)

    const file = makeFile()
    const input = screen.getByLabelText(/upload new profile picture/i) as HTMLInputElement

    await userEvent.upload(input, file)

    const profilePictureField = screen.getByLabelText(/profile picture/i).closest('.profile-edit-profile__field') as HTMLElement
    const saveButton = within(profilePictureField).getByRole('button', { name: /save/i })
    expect(saveButton).not.toBeDisabled()

    const revertButton = within(profilePictureField).getByRole('button', { name: /revert/i })
    expect(revertButton).not.toBeDisabled()
  })

  it('profile picture is saved when save button is clicked', async () => {
    const { user } = mockAuth()
    vi.spyOn(upload, 'uploadImage').mockResolvedValue('http://example.com/url-from-cloudinary.png')
    const mockSetAuthUser = vi.fn()
    vi.spyOn(authContext, 'setAuthUser').mockImplementation(mockSetAuthUser)
    const mockUpdateProfile = vi.fn().mockResolvedValue({ ...user, profileImageUrl: 'http://example.com/fake-image-url.png' })
    vi.spyOn(usersApi, 'useUpdateProfile').mockReturnValue({
      mutateAsync: mockUpdateProfile,
      isPending: false,
      error: null,
    } as any)
    renderWithProviders(<ProfileEditProfile />)

    const file = makeFile()
    const input = screen.getByLabelText(/upload new profile picture/i) as HTMLInputElement

    await userEvent.upload(input, file)

    const profilePictureField = screen.getByLabelText(/profile picture/i).closest('[data-testid="profile-picture-field"]') as HTMLElement
    const saveButton = within(profilePictureField).getByRole('button', { name: /save/i })
    await userEvent.click(saveButton)
    await waitFor(() => {
      expect(mockUpdateProfile).toHaveBeenCalledWith({ profileImageUrl: 'http://example.com/url-from-cloudinary.png' })
      expect(mockSetAuthUser).toHaveBeenCalledWith({ ...user, profileImageUrl: 'http://example.com/fake-image-url.png' })
    })
  })

  it('shows error when upload fails', async () => {
    mockAuth()
    vi.spyOn(upload, 'uploadImage').mockRejectedValue(new ApiError('Upload failed'))
    renderWithProviders(<ProfileEditProfile />)

    const file = makeFile()
    const input = screen.getByLabelText(/upload new profile picture/i) as HTMLInputElement

    await userEvent.upload(input, file)

    const profilePictureField = screen.getByLabelText(/profile picture/i).closest('.profile-edit-profile__field') as HTMLElement
    const saveButton = within(profilePictureField).getByRole('button', { name: /save/i })
    await userEvent.click(saveButton)

    expect(await screen.findByText(/upload failed/i)).toBeInTheDocument()
  })

  it('profile picture is reverted when revert button is clicked', async () => {
    mockAuth()
    renderWithProviders(<ProfileEditProfile />)

    const file = makeFile()
    const input = screen.getByLabelText(/upload new profile picture/i) as HTMLInputElement

    await userEvent.upload(input, file)

    const profilePictureField = screen.getByLabelText(/profile picture/i).closest('.profile-edit-profile__field') as HTMLElement
    const revertButton = within(profilePictureField).getByRole('button', { name: /revert/i })
    await userEvent.click(revertButton)

    const preview = screen.getByAltText(/profile preview/i) as HTMLImageElement
    await waitFor(() => expect(preview.src).toBe('https://example.com/profile.jpg'))
  })
})