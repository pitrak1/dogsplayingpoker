import { setAuthUser, useAuth } from '@/context/auth'
import { useEffect, useState } from 'react'
import { getAvatarFallback, convertImageUrlToSize } from '@/lib/avatar'
import { ImageUpload } from '@/components/forms/imageUpload'
import { uploadImage } from '@/lib/upload'
import './profileEditProfile.scss'
import { useUpdateProfile } from '@/api/users'
import { ApiError } from '@/api/errors'
import { ErrorBanner } from '@/components/forms/errorBanner'

export function ProfileEditProfile() {
  const { user } = useAuth()
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [username, setUsername] = useState<string>(user?.username ?? '')
  const [formError, setFormError] = useState<string | null>(null)
  const { mutateAsync: updateProfile, isPending } = useUpdateProfile()

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null
    setFile(file)
    setPreviewUrl(file ? URL.createObjectURL(file) : null)
    e.target.value = ''
  }

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl ?? '')
    }
  }, [previewUrl])

  const usernameSaveDisabled = username === user?.username || isPending
  const imageSaveDisabled = !file || isPending

  const handleUsernameSave = async () => {
    try {
      const updatedUser = await updateProfile({ username })
      setAuthUser(updatedUser)
    } catch (err) {
      if (err instanceof ApiError) {
        setFormError(err.message)
      }
    }
  }

  const handleImageSave = async () => {
    if (!file) return
    try {
      const imageUrl = await uploadImage(file)
      const updatedUser = await updateProfile({ profileImageUrl: imageUrl })
      setAuthUser(updatedUser)
      setFile(null)
      setPreviewUrl(null)
    } catch (err) {
      if (err instanceof ApiError) {
        setFormError(err.message)
      }
    }
  }

  const handleRevert = () => {
    setFile(null)
    setPreviewUrl(null)
  }

  const getPreviewSrcForSize = (size: number) =>
    previewUrl ||
    convertImageUrlToSize(user?.profileImageUrl ?? null, size) ||
    getAvatarFallback(user?.username ?? null, size)

  return (
    <div className="profile-edit-profile">
      <ErrorBanner message={formError} />
      <div className="settings-block profile-edit-profile__field">
        <label className="profile-edit-profile__label" htmlFor="username">Username</label>
        <small className="profile-edit-profile__description">
          This is your unique username that will be displayed on your profile and used in your
          profile URL.
        </small>
        <div className="profile-edit-profile__input-and-submit">
          <input
            type="text"
            className="profile-edit-profile__input"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button className="profile-edit-profile__submit" disabled={usernameSaveDisabled} onClick={handleUsernameSave}>
            Save
          </button>
        </div>
      </div>
      <div className="settings-block profile-edit-profile__field" data-testid="profile-picture-field">
        <label className="profile-edit-profile__label" htmlFor="profileImage">Profile picture</label>
        <small className="profile-edit-profile__description">
          Please use a picture of yourself to be displayed on your profile.
        </small>
        <div className="profile-edit-profile__avatar-displays">
          <div className="profile-edit-profile__avatar-preview profile-edit-profile__avatar-profile">
            <img
              src={getPreviewSrcForSize(128)}
              alt="Profile preview"
              className="avatar__profile"
            />
            <div>Profile preview</div>
          </div>
          <div className="profile-edit-profile__avatar-preview profile-edit-profile__avatar-user-menu">
            <img
              src={getPreviewSrcForSize(40)}
              alt="User menu icon preview"
              className="avatar__menu"
            />
            <div>User menu icon preview</div>
          </div>
          <div className="profile-edit-profile__avatar-preview profile-edit-profile__avatar-marker">
            <img src={getPreviewSrcForSize(36)} alt="Map marker preview" className="avatar__marker" />
            <div>Map marker preview</div>
          </div>
        </div>
        <div className="profile-edit-profile__image-buttons">
          <div className="profile-edit-profile__image-upload">
            <ImageUpload name="profileImage" label="Upload new profile picture" value={null} onChange={onChange} />
          </div>
          <button className="profile-edit-profile__image-button" disabled={imageSaveDisabled} onClick={handleImageSave}>
            Save
          </button>
          <button className="profile-edit-profile__image-button" disabled={imageSaveDisabled} onClick={handleRevert}>
            Revert
          </button>
        </div>
      </div>
    </div>
  )
}
