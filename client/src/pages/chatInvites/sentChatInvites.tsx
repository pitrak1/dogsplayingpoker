import { useSentInvites } from '@/api/invites'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { User } from 'dogsplayingpoker-shared/user'
import { InviteDisplay } from '@/components/inviteDisplay'
import { Pagination } from '@/components/pagination'
import { Select } from '@mantine/core'
import './sentChatInvites.scss'


export function SentChatInvites() {
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const { data } = useSentInvites({ page, pageSize })
  const navigate = useNavigate();

  const hasInvites = data && data.invites.length > 0

  const handleViewProfileClick = (user: User) => {
    navigate(`/profile/${user.username}`)
  }

  return (
    <div className="sent-chat-invites">
      <div className="sent-chat-invites__info-banner">
        <small>Showing {data?.invites.length} of {data?.totalCount} invites</small>
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
        i.receiver && <InviteDisplay 
          key={i.id} 
          invite={i} 
          user={i.receiver} 
          onViewProfile={handleViewProfileClick}
          type={'sent'}
          disabled={false}
        />
      ))}
      <Pagination pageNumber={page} pageSize={pageSize} totalCount={data?.totalCount ?? 0} onPageChange={setPage}/>
      
    </div>
  )
}
