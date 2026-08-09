import { setAuthUser, useAuth } from '@/context/auth'
import { useEffect, useState } from 'react'
import { ImageUpload } from '@/components/forms/imageUpload'
import { uploadImage } from '@/lib/upload'
import { useUpdateProfile } from '@/api/users'
import { ApiError } from '@/api/errors'
import { ErrorBanner } from '@/components/forms/errorBanner'
import { AvatarDisplay } from '@/components/avatarDisplay'
import { Button } from '@mantine/core'
import { FieldLabel } from '@/components/forms/fieldLabel'
import './profileEditProfile.scss'

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

  const userWithPreviewImage = user && { ...user, profileImageUrl: previewUrl || user.profileImageUrl }

  return (
    <div className="profile-edit-profile">
      <ErrorBanner message={formError} />
      <div className="profile-edit-profile__field">
        <FieldLabel
          name="username"
          label="Username"
          description="This is your unique username that will be displayed on your profile and used in your
          profile URL."
        >
          <div className="profile-edit-profile__input-and-save">
            <input
              type="text"
              className="profile-edit-profile__input"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Button disabled={usernameSaveDisabled} onClick={handleUsernameSave} size="md">Save</Button>
          </div>
        </FieldLabel>
      </div>
      <div className="profile-edit-profile__field" data-testid="profile-picture-field">
        <FieldLabel
          name="profileImage"
          label="Profile picture"
          description="Please use a picture of yourself to be displayed on your profile."
        >
          <div className="profile-edit-profile__avatar-input">
            <div className="profile-edit-profile__avatar-displays">
              <div className="profile-edit-profile__avatar-preview">
                <AvatarDisplay imageUrl={userWithPreviewImage?.profileImageUrl ?? null} name={userWithPreviewImage?.username ?? null} size={128} alt="profile preview"/>
                <div>Profile preview</div>
              </div>
              <div className="profile-edit-profile__avatar-preview">
                <AvatarDisplay imageUrl={userWithPreviewImage?.profileImageUrl ?? null} name={userWithPreviewImage?.username ?? null} size={40} alt="user menu icon preview"/>
                <div>User menu icon preview</div>
              </div>
              <div className="profile-edit-profile__avatar-preview">
                <AvatarDisplay imageUrl={userWithPreviewImage?.profileImageUrl ?? null} name={userWithPreviewImage?.username ?? null} size={36} alt="map marker icon preview"/>
                <div>Map marker preview</div>
              </div>
            </div>
            <div className="profile-edit-profile__image-buttons">
              <ImageUpload name="profileImage" label="Upload new profile picture" onChange={onChange} />
              <Button size="lg" disabled={imageSaveDisabled} onClick={handleImageSave}>Save</Button>
              <Button size="lg" disabled={imageSaveDisabled} onClick={handleRevert}>Revert</Button>
            </div>
          </div>
        </FieldLabel>
      </div>
    </div>
  )
}
