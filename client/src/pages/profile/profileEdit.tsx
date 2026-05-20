import { useNavigate, useParams } from 'react-router'
import { UserRound, Wrench, PawPrint, MapPin } from 'lucide-react'
import { ProfileEditAccount } from './profileEditAccount'
import { ProfileEditProfile } from './profileEditProfile'
import { ProfileEditPets } from './profileEditPets'
import { ProfileEditLocation } from './profileEditLocation'
import './profileEdit.scss'

export function ProfileEdit() {
    const { tab = 'account' } = useParams<{ tab: string }>()
    const navigate = useNavigate()

    const tabInfo = [
        { name: 'account', label: 'Account settings', icon: <Wrench />, url: '/profile/edit/account', component: <ProfileEditAccount /> },
        { name: 'profile', label: 'Your profile', icon: <UserRound />, url: '/profile/edit/profile', component: <ProfileEditProfile /> },
        { name: 'pets', label: 'Your pets', icon: <PawPrint />, url: '/profile/edit/pets', component: <ProfileEditPets /> },
        { name: 'location', label: 'Your location', icon: <MapPin />, url: '/profile/edit/location', component: <ProfileEditLocation /> },
    ]

    const renderTabButtons = () => {
        return tabInfo.map((tabItem) => (
            <button
                key={tabItem.name}
                className={`profile-edit__tab-button ${tab === tabItem.name ? 'active' : ''}`}
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
        <div className="profile-edit">
            <h1 className="profile-edit__title">Edit profile</h1>
            <h2 className="profile-edit__subtitle">Manage your account and profile settings</h2>
            <div className="profile-edit__content">
                <div className="profile-edit__tabs">
                    {renderTabButtons()}
                </div>
                <div className="profile-edit__form">
                    {renderActiveTab()}
                </div>
            </div>
        </div>
    )
}

