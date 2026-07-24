import { FullChatInvite } from 'dogsplayingpoker-shared/invite'
import { getAvatarFallback } from '@/lib/avatar'

import './inviteDisplay.scss'
import { User } from 'dogsplayingpoker-shared/user'

type Props = {
  invite: FullChatInvite
  user: User
  onViewProfile: (user: User) => void
  onAccept?: (inviteId: number) => void
  onDecline?: (inviteId: number) => void
  disabled?: boolean
  type: 'sent' | 'received'
}

export function InviteDisplay({ invite, user, onViewProfile, onAccept, onDecline, disabled, type }: Props) {
  const src = user?.profileImageUrl ?? getAvatarFallback(user?.username, 128)
  
  const text = type === 'sent' ? `You've invited ${user.username} to chat.` : `${user.username} has invited you to chat.`
  return (
    <div className="invite-display">
      <img src={src} alt={user.username} className="invite-display__image" />
      <div className="invite-display__info">
        <div className="invite-display__username">{text}</div>
        {invite.message ? (
          <div className="invite-display__message">{invite.message}</div>
        ) : (
          <div className="invite-display__empty">No message was included.</div>
        )}
        <div className="invite-display__buttons">
          <button className="invite-display__profile-button" onClick={() => onViewProfile(user)}>View profile</button>
          {type === 'received' && onAccept && <button className="invite-display__accept-button" onClick={() => onAccept(invite.id)} disabled={disabled}>Accept</button>}
          {type === 'received' && onDecline && <button className="invite-display__decline-button" onClick={() => onDecline(invite.id)} disabled={disabled}>Decline</button>}
        </div>
      </div>
    </div>
  )
}
