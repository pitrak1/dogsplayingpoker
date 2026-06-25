import { useAuth } from '@/context/auth'
import { AddEditPetForm } from '@/components/forms/addEditPetForm'
import './profileEditPets.scss'

export function ProfileEditPets() {
  const { user } = useAuth()

  const hasPets = user && user.pets && user.pets.length > 0

  return (
    <div className="profile-edit-pets">
      <div className="profile-edit-pets__header">
        <h2 className="settings-title">Your pets</h2>
        <small className="settings-subtitle">Edit and add new pets here</small>
      </div>
      <div className="profile-edit-pets__pets-list">
        {!hasPets && <div className="profile-edit-pets__empty">You currently have no pets added</div>}
      </div>
      <AddEditPetForm />
    </div>
  )
}
