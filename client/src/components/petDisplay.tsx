import { Pet, ReactivityType, reactivityTypeSchema, displaySizeMap } from 'dogsplayingpoker-shared/pet'
import { 
  Baby, 
  PersonStanding, 
  Dog, 
  Cat, 
  StickyNote, 
  ChevronDown, 
  ChevronUp, 
  LucideIcon,
  SquarePen
} from 'lucide-react'
import { useState } from 'react'
import { getAvatarFallback } from '@/lib/avatar'
import './petDisplay.scss'

type Props = {
  pet: Pet
  onEditClick?: (pet: Pet) => void
}

const iconMap: Record<ReactivityType, LucideIcon> = {
  Dogs: Dog,
  Cats: Cat,
  Kids: Baby,
  People: PersonStanding
}

const reactivitySchemaMap: Record<ReactivityType, { value: keyof Pet, notes: keyof Pet}> = {
  Dogs: { value: 'dogReactivity', notes: 'dogReactivityNotes' },
  Cats: { value: 'catReactivity', notes: 'catReactivityNotes' },
  Kids: { value: 'kidReactivity', notes: 'kidReactivityNotes' },
  People: { value: 'peopleReactivity', notes: 'peopleReactivityNotes' }
}

export function PetDisplay({ pet, onEditClick }: Props) {
  const [notesShown, setNotesShown] = useState<ReactivityType | null>(null)

  const displayAge = () => {
    if (pet.age === 0) return 'Less than a year old'
    if (pet.age === 1) return '1 year old'
    return `${pet.age} years old`
  }

  const handleNotesToggle = (type: ReactivityType) => {
    setNotesShown(notesShown === type ? null : type)
  }

  const pictureSrc = pet.pictureUrl ?? getAvatarFallback(pet.name, 128)

  const displayReactivity = (type: ReactivityType, hideNoteButton: boolean = false) => {
    const Icon = iconMap[type]
    const { value: valueKey, notes: notesKey } = reactivitySchemaMap[type]
    const value = pet[valueKey]
    const notes = pet[notesKey]

    return (
      <div key={type}className={`pet-display__reactivity-item--${value}`}>
        <Icon size={24} />
        {type}
        {!hideNoteButton && notes && (
          <>
            <div className="divider__vert" />
            <button 
              className="pet-display__reactivity-notes-button"
              aria-label={`toggle ${type} reactivity notes`}
              onClick={() => handleNotesToggle(type)}
            >
              <StickyNote size={18} aria-hidden="true"/>
              {notesShown === type ? 
                (<ChevronUp size={18} aria-hidden="true"/>) : 
                (<ChevronDown size={18} aria-hidden="true"/>)}
            </button>
          </>
        )}
      </div>
    )
  }

  const displayNotes = () => {
    if (!notesShown) return null

    const { notes: notesKey } = reactivitySchemaMap[notesShown]
    const notes = pet[notesKey]

    return (
      <>
        <div className="divider__hor" />
        <div className="pet-display__notes">
          {displayReactivity(notesShown, true)}
          <div className="pet-display__notes-text">{notes}</div>
        </div>
      </>
    )
  }

  return (
    <div className="pet-display">
      <div className="pet-display__body-without-notes">
        <img
          src={pictureSrc}
          alt={`Picture of ${pet.name}`}
          className="pet-display__picture"
        />
        <div className="pet-display__info">
          <div className="pet-display__headline">
            <div className="pet-display__name">{pet.name}</div>
            <div className="pet-display__age">{displayAge()}</div>
          </div>
          <div className="pet-display__subtitle">{pet.breed} &bull; {displaySizeMap[pet.size]}</div>
          <div className="pet-display__reactivity">
            {reactivityTypeSchema.options.map((type) => displayReactivity(type))}
          </div>
        </div>
        {onEditClick && (
          <button className="pet-display__edit-button" onClick={() => onEditClick(pet)}>
            <SquarePen size={20} />
            Edit
          </button>
        )}
      </div>
      {displayNotes()}
    </div>
  )
}