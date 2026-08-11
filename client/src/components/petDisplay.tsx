import { Pet, reactivityTypeSchema, displaySizeMap } from 'dogsplayingpoker-shared/pet'
import { SquarePen } from 'lucide-react'
import { useState } from 'react'
import { AvatarDisplay } from './avatarDisplay'
import { Button, Divider } from '@mantine/core'
import { ReactivityDisplay } from './reactivityDisplay'
import './petDisplay.scss'

type Props = {
  pet: Pet
  onEditClick?: (pet: Pet) => void
}

export function PetDisplay({ pet, onEditClick }: Props) {
  const [notesShown, setNotesShown] = useState<boolean>(false)

  const displayAge = () => {
    if (pet.age === 0) return 'Less than a year old'
    if (pet.age === 1) return '1 year old'
    return `${pet.age} years old`
  }

  const handleNotesClick = () => {
    setNotesShown((prev) => !prev)
  }

  return (
    <div className="pet-display">
      <div className="pet-display__body-without-notes">
        <AvatarDisplay 
          imageUrl={pet.pictureUrl} 
          name={pet.name} 
          alt={`picture of ${pet.name}`} 
          size={128} 
        />
        <div className="pet-display__info">
          <div className="pet-display__header">
            <div className="pet-display__name">{pet.name}</div>
            <div className="pet-display__age">{displayAge()}</div>
          </div>
          <div className="pet-display__subtitle">{pet.breed} &bull; {displaySizeMap[pet.size]}</div>
          <div className="pet-display__reactivity">
            {reactivityTypeSchema.options.map((type) => (
              <ReactivityDisplay 
                key={type}
                pet={pet} 
                type={type}
                displayNotes={false}
                notesOpen={notesShown} 
                onNotesClick={handleNotesClick} 
              />
            ))}
          </div>
        </div>
        {onEditClick && (
          <Button size="lg" onClick={() => onEditClick(pet)} leftSection={<SquarePen size={20} />}>
            Edit
          </Button>
        )}
      </div>
      {notesShown && (
        <>
          <Divider size="xs" color="black" w="100%"/>
          <div className="pet-display__notes">
            {reactivityTypeSchema.options.map((type) => (
              <ReactivityDisplay
                key={type}
                pet={pet} 
                type={type} 
                displayNotes={true}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}