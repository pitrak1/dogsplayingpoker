import { useNavigate } from 'react-router'
import { useAuth } from '@/context/auth'
import './profileEdit.scss'
import { User } from '@/types/user'

export function ProfileEdit({ user }: { user?: User }) {
    const { user: currentUser } = useAuth()
    const isProfileOwner = user == null || user?.id === currentUser?.id
    const profileUser = user || currentUser
    const navigate = useNavigate()

    const src = profileUser?.profileImageUrl ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(profileUser?.username || '')}&background=e8a87c&color=fff&size=128`
    const onEditClick = () => {
        navigate('/profile/edit', { replace: true })
    }
    return (
        <div className="profile">
            <img src={src} alt={profileUser?.username} className="avatar avatar--large" />
            <h1>{profileUser?.username}</h1>
            {isProfileOwner && <button onClick={onEditClick}>Edit</button>}
        </div>
    )
}

