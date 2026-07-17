import { useSentInvites, useReceivedInvites } from '@/api/invites'
import { useAuth } from '@/context/auth'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { User } from 'dogsplayingpoker-shared/user'

import './invites.scss'
import { InviteDisplay } from '@/components/inviteDisplay'

export function Invites() {
  const { user } = useAuth()
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const { data: sentInvites } = useSentInvites(user?.id, { page, pageSize })
  const { data: receivedInvites } = useReceivedInvites(user?.id, { page, pageSize })
  const navigate = useNavigate();

  console.log(sentInvites)
  console.log(receivedInvites)

  const hasReceivedInvites = receivedInvites && receivedInvites.invites.length > 0
  const hasSentInvites = sentInvites && sentInvites.invites.length > 0

  const handleViewProfileClick = (user: User) => {
    navigate(`/profile/${user.username}`)
  }

  const handleInviteAccept = (inviteId: number) => {
    console.log('accept', inviteId);
  }

  const handleInviteDecline = (inviteId: number) => {
    console.log('decline', inviteId);
  }

  return (
    <div className="invites">
      <h2 className="invites__section-title">Received invites</h2>
      {hasReceivedInvites && receivedInvites.invites.map((i) => (
        i.sender && <InviteDisplay 
          key={i.id} 
          invite={i} 
          user={i.sender} 
          onViewProfile={handleViewProfileClick}
          onAccept={handleInviteAccept}
          onDecline={handleInviteDecline}
          type={'received'} 
        />
      ))}
      <h2 className="invites__section-title">Sent invites</h2>
      {hasSentInvites && sentInvites.invites.map((i) => (
        i.receiver && <InviteDisplay 
          key={i.id} 
          invite={i} 
          user={i.receiver} 
          onViewProfile={handleViewProfileClick}
          type={'sent'}
        />
      ))}
    </div>
  )
}
