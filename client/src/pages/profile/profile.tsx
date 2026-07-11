import { useParams } from 'react-router'
import { useAuth } from '@/context/auth'
import { Dot, Calendar, MapPin, MessageCircle } from 'lucide-react'
import { useUserByUsername } from '@/api/users'
import { useRef } from 'react'
import { InviteModal } from './inviteModal'
import { getAvatarFallback } from '@/lib/avatar'
import { PetDisplay } from '@/components/petDisplay'
import { Pet } from 'dogsplayingpoker-shared/schemas/pet'
import './profile.scss'

export function Profile() {
  const { username } = useParams<{ username: string }>()
  const { data: user } = useUserByUsername(username!)
  const { user: currentUser } = useAuth()
  const inviteModalRef = useRef<HTMLDialogElement>(null)

  // const isProfileOwner = user?.username && user?.username === currentUser?.username
  const isProfileOwner = false
  const src = user?.profileImageUrl ?? getAvatarFallback(user?.username, 128)

  const onMessageClick = () => {
    handleOpenInviteModal()
  }

  const handleOpenInviteModal = () => inviteModalRef.current?.showModal()
  const handleCloseInviteModal = () => inviteModalRef.current?.close()

  return (
    <div className="profile">
      <img src={src} alt={user?.username} className="profile__profile-image" />
      <div className="profile__user-info">
        <h1 className="profile__username">{user?.username}</h1>
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

      <button className="profile__message-button" onClick={onMessageClick} disabled={isProfileOwner}>
        <MessageCircle size={20} />
        Send message
      </button>
      <InviteModal ref={inviteModalRef} user={user} onClose={handleCloseInviteModal} />
      {user?.pets?.map((pet: Pet) => <PetDisplay pet={pet} />)}
    </div>
  )
}
