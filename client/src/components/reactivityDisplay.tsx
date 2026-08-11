import { Pet, ReactivityType, Reactivity } from 'dogsplayingpoker-shared/pet'
import { Baby, PersonStanding, Dog, Cat, StickyNote, ChevronRight, LucideIcon } from 'lucide-react'
import { Divider, UnstyledButton } from '@mantine/core'
import './reactivityDisplay.scss'


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

type Props = {
  pet: Pet
  type: ReactivityType
  displayNotes: boolean
  notesOpen?: boolean
  onNotesClick?: () => void
}

export function ReactivityDisplay({ pet, type, displayNotes, notesOpen, onNotesClick }: Props) {
  const Icon = iconMap[type]
  const { value: valueKey, notes: notesKey } = reactivitySchemaMap[type]
  const level = pet[valueKey] as Reactivity
  const notes = pet[notesKey]

  if (displayNotes && !notes) return

  return (
    <div className="reactivity-display">
      <div className={`reactivity-display--${level}`}>
        <Icon size={24} />
        {type}
        {!!notes && !displayNotes && (
          <>
            <Divider orientation='vertical' color='black'/>
            <UnstyledButton 
              aria-label={`toggle ${type} reactivity notes`} 
              onClick={() => onNotesClick?.()}
            >
              <div className="reactivity-display__button">
                <StickyNote size={18} aria-hidden="true"/>
                <ChevronRight className="reactivity-display__chevron" data-opened={notesOpen}/>
              </div>
            </UnstyledButton>
          </>
        )}
      </div>
      {displayNotes && <div className="reactivity-display__notes">{notes}</div>}
    </div>
  )
}