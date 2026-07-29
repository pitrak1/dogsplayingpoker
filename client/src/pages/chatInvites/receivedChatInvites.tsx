import { useReceivedInvites, useAcceptInvite, useDeclineInvite } from '@/api/invites'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { User } from 'dogsplayingpoker-shared/user'
import { ApiError } from '@/api/errors'
import { InviteDisplay } from '@/components/inviteDisplay'
import { ErrorBanner } from '@/components/forms/errorBanner'
import { Pagination } from '@/components/pagination'
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

  const renderInvites = () => {
    if (!hasInvites) return
    return data.invites.map((i) => (
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
    ))
  }

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value))
  }

  return (
    <div className="received-chat-invites">
      <ErrorBanner message={pageError} />
      <div className="received-chat-invites__info-banner">
        <small>Showing {data?.invites.length} of {data?.totalCount} invites</small>
        <div className="received-chat-invites__page-size">
          <label htmlFor="pageSize">Results per page: </label>
          <select name="pageSize" value={pageSize} onChange={handlePageSizeChange}>Settings
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="25">25</option>
          </select>
        </div>
      </div>
      {renderInvites()}
      <Pagination pageNumber={page} pageSize={pageSize} totalCount={data?.totalCount ?? 0} onPageChange={setPage}/>
    </div>
  )
}
