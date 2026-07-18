import { useSentInvites, useReceivedInvites, useUpdateInviteStatus } from '@/api/invites'
import { useAuth } from '@/context/auth'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { User } from 'dogsplayingpoker-shared/user'
import { ApiError } from '@/api/errors'

import './invites.scss'
import { InviteDisplay } from '@/components/inviteDisplay'
import { ErrorBanner } from '@/components/forms/errorBanner'

export function Invites() {
  const { user } = useAuth()
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const { data: sentInvites } = useSentInvites(user?.id, { page, pageSize })
  const { data: receivedInvites } = useReceivedInvites(user?.id, { page, pageSize })
  const navigate = useNavigate();
  const { mutateAsync: updateInviteStatus, isPending } = useUpdateInviteStatus()
  const [pageError, setPageError]= useState<string | null>(null)

  console.log(sentInvites)
  console.log(receivedInvites)

  const hasReceivedInvites = receivedInvites && receivedInvites.invites.length > 0
  const hasSentInvites = sentInvites && sentInvites.invites.length > 0

  const handleViewProfileClick = (user: User) => {
    navigate(`/profile/${user.username}`)
  }

  const handleInviteAccept = async (inviteId: number) => {
    try {
      await updateInviteStatus({ id: inviteId, status: 'accepted' })
    } catch (err) {
      if (err instanceof ApiError) {
        setPageError(err.message)
      }
    }
  }

  const handleInviteDecline = async (inviteId: number) => {
    try {
      await updateInviteStatus({ id: inviteId, status: 'declined' })
    } catch (err) {
      if (err instanceof ApiError) {
        setPageError(err.message)
      }
    }
  }

  return (
    <div className="invites">
      <ErrorBanner message={pageError} />
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
