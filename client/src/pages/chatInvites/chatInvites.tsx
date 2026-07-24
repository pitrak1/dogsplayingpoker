import { useNavigate, useParams } from 'react-router'
import { Inbox, Send } from 'lucide-react'
import { ReceivedChatInvites } from './receivedChatInvites'
import { SentChatInvites } from './sentChatInvites'
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

  const renderTabButtons = () => {
    return tabInfo.map((tabItem) => (
      <button
        key={tabItem.name}
        className={`chat-invites__tab-button${tab === tabItem.name ? '-active' : ''}`}
        onClick={() => navigate(tabItem.url)}
      >
        {tabItem.icon}
        {tabItem.label}
      </button>
    ))
  }

  const renderActiveTab = () => {
    const activeTab = tabInfo.find((tabItem) => tabItem.name === tab)
    return activeTab ? activeTab.component : null
  }

  return (
    <div className="chat-invites">
      <div className="chat-invites__header">
        <h1 className="chat-invites__title">Chat invites</h1>
        <small className="chat-invites__subtitle">Manage the invites you've sent and received</small>
      </div>
      <div className="chat-invites__tabs">{renderTabButtons()}</div>
      <div className="chat-invites__display">{renderActiveTab()}</div>
    </div>
  )
}
