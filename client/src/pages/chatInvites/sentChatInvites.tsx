import { useSentInvites } from '@/api/invites'
import { useAuth } from '@/context/auth'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { User } from 'dogsplayingpoker-shared/user'
import { InviteDisplay } from '@/components/inviteDisplay'
import { Pagination } from '@/components/pagination'
import './sentChatInvites.scss'


export function SentChatInvites() {
  const { user } = useAuth()
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const { data } = useSentInvites(user?.id, { page, pageSize })
  const navigate = useNavigate();

  const hasInvites = data && data.invites.length > 0

  const handleViewProfileClick = (user: User) => {
    navigate(`/profile/${user.username}`)
  }

  const renderInvites = () => {
    if (!hasInvites) return
    return data.invites.map((i) => (
      i.receiver && <InviteDisplay 
        key={i.id} 
        invite={i} 
        user={i.receiver} 
        onViewProfile={handleViewProfileClick}
        type={'sent'}
        disabled={false}
      />
    ))
  }

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value))
  }

  return (
    <div className="sent-chat-invites">
      <div className="sent-chat-invites__info-banner">
        <small>Showing {data?.invites.length} of {data?.totalCount} invites</small>
        <div className="sent-chat-invites__page-size">
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
