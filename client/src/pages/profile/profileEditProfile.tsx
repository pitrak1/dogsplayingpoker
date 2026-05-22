import { useAuth } from '@/context/auth'
import { useState } from 'react'
import { getAvatarFallback, convertImageUrlToSize } from '@/lib/avatar'
import './profileEditProfile.scss'

export function ProfileEditProfile() {
  const { user } = useAuth()
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null
    console.log('Selected file:', file)
  }

  const getPreviewSrcForSize = (size: number) =>
    previewUrl ||
    convertImageUrlToSize(user?.profileImageUrl ?? null, size) ||
    getAvatarFallback(user?.username ?? null, size)

  console.log(getPreviewSrcForSize(128), getPreviewSrcForSize(40), getPreviewSrcForSize(36))

  return (
    <div className="profile-edit-profile">
      <div className="profile-edit-profile__field">
        <label className="profile-edit-profile__label">Username</label>
        <small className="profile-edit-profile__description">
          This is your unique username that will be displayed on your profile and used in your
          profile URL.
        </small>
        <div className="profile-edit-profile__input-and-submit">
          <input
            type="text"
            className="profile-edit-profile__input"
            defaultValue={user?.username}
          />
          <button className="profile-edit-profile__submit">Save</button>
        </div>
      </div>
      <div className="profile-edit-profile__field">
        <label className="profile-edit-profile__label">Profile picture</label>
        <small className="profile-edit-profile__description">
          Please use a picture of yourself to be displayed on your profile.
        </small>
        <div className="profile-edit-profile__avatar-displays">
          <div className="profile-edit-profile__avatar-profile">
            <img
              src={getPreviewSrcForSize(128)}
              alt="Profile preview"
              className="avatar__profile"
            />
            <div>Profile preview</div>
          </div>
          <div className="profile-edit-profile__avatar-user-menu">
            <img
              src={getPreviewSrcForSize(40)}
              alt="User menu icon preview"
              className="avatar__menu"
            />
            <div>User menu icon preview</div>
          </div>
          <div className="profile-edit-profile__avatar-marker">
            <img src={getPreviewSrcForSize(36)} alt="Profile preview" className="avatar__marker" />
            <div>Map marker preview</div>
          </div>
        </div>
      </div>
    </div>
  )
}
