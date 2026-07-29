import { useParams } from 'react-router'
import { useAuth } from '@/context/auth'
import { Dot, Calendar, MapPin, MessageCircle } from 'lucide-react'
import { useUserByUsername } from '@/api/users'
import { useRef, useState } from 'react'
import { InviteModal } from './inviteModal'
import { getAvatarFallback } from '@/lib/avatar'
import { PetDisplay } from '@/components/petDisplay'
import { Pet } from 'dogsplayingpoker-shared/pet'
import './profile.scss'
import { useCreateInvite } from '@/api/invites'
import { ApiError } from '@/api/errors'
import { ErrorBanner } from '@/components/forms/errorBanner'

export function Profile() {
  const { username } = useParams<{ username: string }>()
  const { data: user } = useUserByUsername(username!)
  const { user: currentUser } = useAuth()
  const inviteModalRef = useRef<HTMLDialogElement>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const { mutateAsync: createInvite, isPending } = useCreateInvite()

  const isProfileOwner = !!user?.username && user?.username === currentUser?.username
  const src = user?.profileImageUrl ?? getAvatarFallback(user?.username, 128)

  const onMessageClick = () => {
    handleOpenInviteModal()
  }

  const handleOpenInviteModal = () => inviteModalRef.current?.showModal()
  const handleCloseInviteModal = () => inviteModalRef.current?.close()

  const handleSendInviteClick = async (message: string) => {
    if (!user || !currentUser) return
    try {
      await createInvite({ receiverId: user.id, message })
      handleCloseInviteModal()
    } catch (err) {
      if (err instanceof ApiError) {
        setFormError(err.message)
      }
    }
  }

  return (
    <div className="profile">
      <ErrorBanner message={formError} />
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
      {user && <InviteModal ref={inviteModalRef} user={user} onClose={handleCloseInviteModal} onSend={handleSendInviteClick} isSendDisabled={isPending}/>}
      {user?.pets?.map((pet: Pet) => <PetDisplay key={pet.id} pet={pet} />)}
    </div>
  )
}
