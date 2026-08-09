import { useNavigate, useParams } from 'react-router'
import { UserRound, Wrench, PawPrint, MapPin } from 'lucide-react'
import { ProfileEditAccount } from './profileEditAccount'
import { ProfileEditProfile } from './profileEditProfile'
import { ProfileEditPets } from './profileEditPets'
import { ProfileEditLocation } from './location/profileEditLocation'
import { Tabs } from '@mantine/core'
import './profileEdit.scss'

export function ProfileEdit() {
  const { tab = 'account' } = useParams<{ tab: string }>()
  const navigate = useNavigate()

  const tabInfo = [
    {
      name: 'account',
      label: 'Account settings',
      icon: <Wrench />,
      url: '/profile/edit/account',
      component: <ProfileEditAccount />,
    },
    {
      name: 'profile',
      label: 'Your profile',
      icon: <UserRound />,
      url: '/profile/edit/profile',
      component: <ProfileEditProfile />,
    },
    {
      name: 'pets',
      label: 'Your pets',
      icon: <PawPrint />,
      url: '/profile/edit/pets',
      component: <ProfileEditPets />,
    },
    {
      name: 'location',
      label: 'Your location',
      icon: <MapPin />,
      url: '/profile/edit/location',
      component: <ProfileEditLocation />,
    },
  ]

  return (
    <div className="profile-edit">
      <div className="profile-edit__header">
        <h1 className="profile-edit__title">Edit profile</h1>
        <span className="profile-edit__subtitle">Manage your account and profile settings</span>
      </div>
      <Tabs defaultValue={tab} orientation="vertical">
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
