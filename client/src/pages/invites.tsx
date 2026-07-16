import { useSentInvites, useReceivedInvites } from '@/api/invites'
import { useAuth } from '@/context/auth'
import { useState } from 'react'

import './invites.scss'
import { InviteDisplay } from '@/components/inviteDisplay'

export function Invites() {
  const { user } = useAuth()
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const { data: sentInvites } = useSentInvites(user?.id, { page, pageSize })
  const { data: receivedInvites } = useReceivedInvites(user?.id, { page, pageSize })

  console.log(sentInvites)
  console.log(receivedInvites)

  return (
    <div className="invites">
      <h2 className="invites__section-title">Received invites</h2>
      {receivedInvites.invites.length > 0 && receivedInvites.invites.map((i) => (
        <InviteDisplay invite={i} type={'received'} />
      ))}
      <h2 className="invites__section-title">Sent invites</h2>
    </div>
  )
}
