import { Invite } from 'dogsplayingpoker-shared/schemas/invite'

import './inviteDisplay.scss'
import { User } from 'dogsplayingpoker-shared/schemas/user'

type Props = {
  invite: Invite
  type: 'sent' | 'received'
}

const typeToKeyMap = {
  sent: 'receiver',
  received: 'sender'
}

export function InviteDisplay({ invite, type }: Props) {
  const displayUserKey = typeToKeyMap[type] as keyof Invite
  const displayUser = invite[displayUserKey] as User
  return <div>{invite.message}{displayUser.username}</div>
}
