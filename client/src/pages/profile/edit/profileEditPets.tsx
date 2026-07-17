import { useAuth } from '@/context/auth'
import { AddEditPetForm } from '@/components/forms/addEditPetForm'
import { usePetsForOwner } from '@/api/pets'
import { Pet } from 'dogsplayingpoker-shared/pet'
import { PetDisplay } from '@/components/petDisplay'
import { useState } from 'react'
import './profileEditPets.scss'

export function ProfileEditPets() {
  const { user } = useAuth()
  const { data: pets } = usePetsForOwner(user?.id)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formPet, setFormPet] = useState<Pet | null>(null)

  const hasPets = pets && pets.length > 0

  const handleEditClick = (pet: Pet) => {
    setFormPet(pet)
    setIsFormOpen(true)
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setFormPet(null)
  }

  const handleAddNewPetClick = () => {
    setFormPet(null)
    setIsFormOpen(true)
  }

  return (
    <div className="profile-edit-pets">
      <div className="profile-edit-pets__header">
        <h2 className="settings-title">Your pets</h2>
        <small className="settings-subtitle">Edit and add new pets here</small>
      </div>
      <div className="profile-edit-pets__pets-list">
        {!hasPets && <div className="profile-edit-pets__empty">You currently have no pets added</div>}
        {hasPets && pets.map((p: Pet) => <PetDisplay key={p.id} pet={p} onEditClick={handleEditClick} />)}
      </div>
      {!isFormOpen && (
        <button className="primary-button" onClick={handleAddNewPetClick}>
          Add a new pet
        </button>
      )}
      {isFormOpen && (
        <AddEditPetForm pet={formPet} onClose={handleFormClose} />
      )}
    </div>
  )
}
