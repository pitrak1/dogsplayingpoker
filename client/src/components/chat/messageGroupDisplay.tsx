import { MessageGroup } from 'dogsplayingpoker-shared/message'
import { AvatarDisplay } from '../avatarDisplay'
import { useMemo } from 'react'
import { useAuth } from '@/context/auth'
import './messageGroupDisplay.scss'
import { Link } from 'react-router'

type Props = {
  group: MessageGroup
}

export function MessageGroupDisplay({ group }: Props) {
  const { user } = useAuth()
  const { user: creator, createdAt, messages } = group

  const isCreator = useMemo(() => user?.id === creator?.id, [user, creator])

  return (
    <div className={`message-group-display${isCreator ? '--creator' : ''}`}>
      {isCreator ? (
        <div className="message-group-display__header">
          <div className="message-group-display__timestamp">{new Date(createdAt).toLocaleString()}</div>
        </div>
      ) : (
        <div className="message-group-display__header">
          <Link to={`/profile/${creator.username}`} className="message-group-display__profile-button" aria-label={`${creator.username} profile button`}>
            <AvatarDisplay imageUrl={creator.profileImageUrl} name={creator.username} size={32} />
            <div className="message-group-display__username">{creator.username}</div>
          </Link>
          <div className="message-group-display__timestamp">{new Date(createdAt).toLocaleString()}</div>
        </div>
      )}
      
      {messages.map(m => (
        <div className={`message-group-display__message${isCreator ? '--creator' : ''}`}>
          {m.content}
        </div>
      ))}
    </div>
  )
}
