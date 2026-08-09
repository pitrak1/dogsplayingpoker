import { AddEditPetForm } from '@/components/forms/addEditPetForm'
import { usePets } from '@/api/pets'
import { Pet } from 'dogsplayingpoker-shared/pet'
import { PetDisplay } from '@/components/petDisplay'
import { useState } from 'react'
import { Button } from '@mantine/core'
import './profileEditPets.scss'

export function ProfileEditPets() {
  const { data: pets } = usePets()
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
        <h2 className="profile-edit-pets__title">Your pets</h2>
        <span className="profile-edit-pets__subtitle">Edit and add new pets here</span>
      </div>
      <div className="profile-edit-pets__pets-list">
        {!hasPets && <div className="profile-edit-pets__empty">You currently have no pets added</div>}
        {hasPets && pets.map((p: Pet) => <PetDisplay key={p.id} pet={p} onEditClick={handleEditClick} />)}
      </div>
      {!isFormOpen && (
        <Button size="lg" m="0 4rem" onClick={handleAddNewPetClick}>
          Add a new pet
        </Button>
      )}
      {isFormOpen && (
        <AddEditPetForm pet={formPet} onClose={handleFormClose} />
      )}
    </div>
  )
}
