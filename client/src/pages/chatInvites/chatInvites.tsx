import { useNavigate, useParams } from 'react-router'
import { Inbox, Send } from 'lucide-react'
import { ReceivedChatInvites } from './receivedChatInvites'
import { SentChatInvites } from './sentChatInvites'
import { Tabs } from '@mantine/core'
import './chatInvites.scss'


export function ChatInvites() {
  const { tab = 'received' } = useParams<{ tab: string }>()
  const navigate = useNavigate();

  const tabInfo = [
    {
      name: 'received',
      label: 'Received',
      icon: <Inbox />,
      url: '/invites/received',
      component: <ReceivedChatInvites />,
    },
    {
      name: 'sent',
      label: 'Sent',
      icon: <Send />,
      url: '/invites/sent',
      component: <SentChatInvites />,
    },
  ]

  return (
    <div className="chat-invites">
      <div className="chat-invites__header">
        <h1 className="chat-invites__title">Chat invites</h1>
        <small className="chat-invites__subtitle">Manage the invites you've sent and received</small>
      </div>
      <Tabs defaultValue={tab} w="100%">
        <Tabs.List>
          {tabInfo.map((tabItem) => (
            <Tabs.Tab key={tabItem.name} value={tabItem.name} onClick={() => navigate(tabItem.url)}>
              <div className="profile-edit__tab">
                {tabItem.icon}
                {tabItem.label}
              </div>
            </Tabs.Tab>
          ))}
        </Tabs.List>
        {tabInfo.map((tabItem) => (
          <Tabs.Panel key={tabItem.name} value={tabItem.name}>
            {tabItem.component}
          </Tabs.Panel>
        ))}
      </Tabs>
    </div>
  )
}
