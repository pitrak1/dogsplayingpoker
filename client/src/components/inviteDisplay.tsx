import { ChatInvite } from 'dogsplayingpoker-shared/invite'
import { User } from 'dogsplayingpoker-shared/user'
import { Button } from '@mantine/core'
import { AvatarDisplay } from './avatarDisplay'
import './inviteDisplay.scss'

type Props = {
  invite: ChatInvite
  user: User
  onViewProfile: (user: User) => void
  onAccept?: (inviteId: number) => void
  onDecline?: (inviteId: number) => void
  disabled?: boolean
  type: 'sent' | 'received'
}

export function InviteDisplay({ invite, user, onViewProfile, onAccept, onDecline, disabled, type }: Props) {
  const text = type === 'sent' ? `You've invited ${user.username} to chat.` : `${user.username} has invited you to chat.`
  return (
    <div className="invite-display">
      <AvatarDisplay imageUrl={user.profileImageUrl} name={user.username} size={128} />
      <div className="invite-display__info">
        <div className="invite-display__username">{text}</div>
        {invite.message ? (
          <div className="invite-display__message">{invite.message}</div>
        ) : (
          <div className="invite-display__empty">No message was included.</div>
        )}
        <div className="invite-display__buttons">
          <Button size="lg" onClick={() => onViewProfile(user)}>View profile</Button>
          {type === 'received' && onAccept && <Button size="lg" color="success" onClick={() => onAccept(invite.id)} disabled={disabled}>Accept</Button>}
          {type === 'received' && onDecline && <Button size="lg" color="error" onClick={() => onDecline(invite.id)} disabled={disabled}>Decline</Button>}
        </div>
      </div>
    </div>
  )
}
