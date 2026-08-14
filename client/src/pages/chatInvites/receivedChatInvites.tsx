import { useReceivedInvites, useAcceptInvite, useDeclineInvite } from '@/api/invites'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { User } from 'dogsplayingpoker-shared/user'
import { ApiError } from '@/api/errors'
import { InviteDisplay } from '@/components/inviteDisplay'
import { ErrorBanner } from '@/components/forms/errorBanner'
import { Pagination } from '@/components/pagination'
import { Select } from '@mantine/core'
import './receivedChatInvites.scss'


export function ReceivedChatInvites() {
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(5)
  const { data } = useReceivedInvites({ page, pageSize })
  const navigate = useNavigate();
  const { mutateAsync: acceptInvite, isPending: isAcceptPending } = useAcceptInvite()
  const { mutateAsync: declineInvite, isPending: isDeclinePending } = useDeclineInvite()
  const [pageError, setPageError]= useState<string | null>(null)

  const hasInvites = data && data.invites.length > 0
  const isPending = isAcceptPending || isDeclinePending


  const handleViewProfileClick = (user: User) => {
    navigate(`/profile/${user.username}`)
  }

  const handleInviteAccept = async (inviteId: number) => {
    try {
      await acceptInvite(inviteId)
    } catch (err) {
      if (err instanceof ApiError) {
        setPageError(err.message)
      }
    }
  }

  const handleInviteDecline = async (inviteId: number) => {
    try {
      await declineInvite(inviteId)
    } catch (err) {
      if (err instanceof ApiError) {
        setPageError(err.message)
      }
    }
  }

  return (
    <div className="received-chat-invites">
      <ErrorBanner message={pageError} />
      <div className="received-chat-invites__info-banner">
        <span className="received-chat-invites__count">Showing {data?.invites.length} of {data?.totalCount} invites</span>
        <Select 
          label="Results per page" 
          // This is to make the label appear on the same line as the select
          styles={{ root: { display: 'flex', alignItems: 'center', gap: 8 }, label: { marginBottom: 0 } }}
          defaultValue={5} 
          data={[5, 10, 25]} 
          value={pageSize} 
          onChange={(value) => value !== null && setPageSize(value)} 
        />
      </div>
      {hasInvites && data.invites.map((i) => (
        i.sender && <InviteDisplay 
          key={i.id} 
          invite={i} 
          user={i.sender} 
          onViewProfile={handleViewProfileClick}
          onAccept={handleInviteAccept}
          onDecline={handleInviteDecline}
          type={'received'}
          disabled={isPending}
        />
      ))}
      <Pagination pageNumber={page} pageSize={pageSize} totalCount={data?.totalCount ?? 0} onPageChange={setPage}/>
    </div>
  )
}
