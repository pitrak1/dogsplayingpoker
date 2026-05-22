import { useNavigate, useParams } from 'react-router'
import { useAuth } from '@/context/auth'
import { Dot, Calendar, MapPin, MessageCircle } from 'lucide-react'
import { useUserByUsername } from '@/api/users'
import './profile.scss'

export function Profile() {
  const { username } = useParams<{ username: string }>()
  const { data: user, isPending, error } = useUserByUsername(username!)
  const { user: currentUser } = useAuth()
  const navigate = useNavigate()

  const isProfileOwner = user == null || user?.id === currentUser?.id
  const profileUser = user || currentUser

  const src =
    profileUser?.profileImageUrl ??
    `https://ui-avatars.com/api/?name=${encodeURIComponent(profileUser?.username || '')}&background=e8a87c&color=fff&size=128`
  const onMessageClick = () => {
    navigate('/profile/edit', { replace: true })
  }

  return (
    <div className="profile">
      <img src={src} alt={profileUser?.username} className="profile__profile-image" />
      <div className="profile__user-info">
        <h1 className="profile__username">{profileUser?.username}</h1>
        <h2 className="profile__user-subtitle">
          <div className="profile__user-subtitle-item">
            <Calendar size={20} className="profile__icon" />
            Since Jun 2023
          </div>
          <Dot size={30} />
          <div className="profile__user-subtitle-item">
            <MapPin size={20} className="profile__icon" />
            15.6 mi
          </div>
        </h2>
      </div>

      <button className="profile__message-button" onClick={onMessageClick}>
        <MessageCircle size={20} className="profile__icon" />
        Send message
      </button>
    </div>
  )
}
