import { ImageUpload } from '@/components/forms/imageUpload'
import { Baby, PersonStanding, Dog, Cat, X } from 'lucide-react'
import { uploadImage } from '@/lib/upload'
import { ApiError } from '@/api/errors'
import { ErrorBanner } from '@/components/forms/errorBanner'
import { Pet, createPetInputSchema, reactivitySchema, sizeSchema, displaySizeMap, Size, Reactivity } from 'dogsplayingpoker-shared/pet'
import { useCreatePet, useEditPet } from '@/api/pets'
import { FormField } from '@/components/forms/formField'
import { z } from 'zod'
import { ReactivityInput } from './reactivityInput'
import { useImageInput } from '@/hooks/useImageInput'
import { useFormValidation } from '@/hooks/useFormValidation'
import { TextInput, Button } from '@mantine/core'
import { AvatarDisplay } from '../avatarDisplay'
import { RadioButtonGroup } from '@/components/forms/radioButtonGroup'
import './addEditPetForm.scss'

type PetFormState = {
  name?: string | null
  age?: number | null
  breed?: string | null
  file?: File | null
  fileUrl?: string | null
  size: z.infer<typeof sizeSchema>
  dogReactivity: z.infer<typeof reactivitySchema>
  dogReactivityNotes?: string | null
  catReactivity: z.infer<typeof reactivitySchema>
  catReactivityNotes?: string | null
  kidReactivity: z.infer<typeof reactivitySchema>
  kidReactivityNotes?: string | null
  peopleReactivity: z.infer<typeof reactivitySchema>
  peopleReactivityNotes?: string | null
}

const emptyFormState = {
  name: null,
  age: null,
  breed: null,
  file: null,
  fileUrl: null,
  size: 'unknown',
  dogReactivity: 'unknown',
  catReactivity: 'unknown',
  kidReactivity: 'unknown',
  peopleReactivity: 'unknown'
} as const

type Props = {
  pet?: Pet | null
  onClose?: () => void
}

export function AddEditPetForm({ pet, onClose }: Props) {
  const isCreateForm = !pet
  const initialState = pet ? {...pet} : emptyFormState
  // Because we always submit the whole pet shape, even on edit, we can validate against createPetSchema
  const { 
    values, 
    fieldErrors, 
    formError,
    setFormError,
    setFormValue,
    validate
  } = useFormValidation<PetFormState, typeof createPetInputSchema>(initialState, createPetInputSchema)
  const { file, fileUrl, onChange: onPictureChange } = useImageInput(values.fileUrl)

  const { mutateAsync: createPet, isPending: isCreating } = useCreatePet()
  const { mutateAsync: editPet, isPending: isEditing } = useEditPet()
  const isPending = isCreating || isEditing

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const result = validate()
    if (!result.success) return
    
    try {
      const pictureUrl = file ? await uploadImage(file) : null
      if (isCreateForm) {
        await createPet({ ...result.data, pictureUrl  })
      } else {
        await editPet({ id: pet.id, input: { ...result.data, pictureUrl }})
      }
      if (onClose) onClose()
    } catch (err) {
      if (err instanceof ApiError) {
        setFormError(err.message)
      }
    }
  }

  return (
    <div className="add-edit-pet-form">
      <ErrorBanner message={formError} />
      <div className="add-edit-pet-form__header">
        <h3 className="add-edit-pet-form__title">
          {pet ? 'Edit Pet' : 'Add a new pet'}
        </h3>
        {onClose && (
          <button 
            className="add-edit-pet-form__close-button" 
            onClick={onClose}
            aria-label="close add/edit pet form"
          >
            <X size={24} />
          </button>
        )}
      </div>
      <form onSubmit={handleSave} className="add-edit-pet-form__form">
        <div className="add-edit-pet-form__non-radio-inputs">
          <div className="add-edit-pet-form__text-inputs">
            <TextInput 
              label="Name" 
              size="lg" 
              value={values.name ?? ''}
              onChange={(e) => setFormValue('name', e.target.value)}
              error={fieldErrors['name']}
              w="400px"
            />
            <TextInput 
              label="Age" 
              size="lg" 
              value={String(values.age ?? '')}
              onChange={(e) => setFormValue('age', Number(e.target.value))}
              error={fieldErrors['age']}
              w="400px"
            />
            <TextInput 
              label="Breed"
              size="lg" 
              value={values.breed ?? ''}
              onChange={(e) => setFormValue('breed', e.target.value)}
              error={fieldErrors['breed']}
              w="400px"
            />
          </div>
          <div className="add-edit-pet-form__picture">
            <label className="add-edit-pet-form__picture-label" htmlFor="pictureUrl">
              Upload a picture
            </label>
            <AvatarDisplay 
              imageUrl={fileUrl ?? pet?.pictureUrl} 
              name={values.name || 'test'} 
              size={128} 
              alt="pet picture preview" 
            />
            <ImageUpload name="pictureUrl" label="Upload" onChange={onPictureChange} />
          </div>
        </div>
        <FormField name="size" label="Size" error={fieldErrors['size']}>
          <RadioButtonGroup
            name="size"
            value={values.size}
            onChange={(value) => setFormValue('size', value as Size)}
            fields={displaySizeMap}
            ariaLabel="size"
          />
        </FormField>
        <div>
          <div className="add-edit-pet-form__reactivity-header">Reactivity</div>
          <span className="add-edit-pet-form__reactivity-subtitle">You can choose to add notes about your pet's reactivity in the field below each reactivity type.</span>
        </div>
        <ReactivityInput
          label="Dogs"
          icon={<Dog size={32} />}
          radioValue={values.dogReactivity}
          onRadioChange={(value) => setFormValue('dogReactivity', value as Reactivity)}
          textName="dogReactivityNotes"
          textValue={values.dogReactivityNotes ?? ''}
          onTextChange={(value) => setFormValue('dogReactivityNotes', value)}
          radioError={fieldErrors['dogReactivity']}
          textError={fieldErrors['dogReactivityNotes']}
        />
        <ReactivityInput
          label="Cats"
          icon={<Cat size={32} />}
          radioValue={values.catReactivity}
          onRadioChange={(value) => setFormValue('catReactivity', value as Reactivity)}
          textName="catReactivityNotes"
          textValue={values.catReactivityNotes ?? ''}
          onTextChange={(value) => setFormValue('catReactivityNotes', value)}
          radioError={fieldErrors['catReactivity']}
          textError={fieldErrors['catReactivityNotes']}
        />
        <ReactivityInput
          label="Kids"
          icon={<Baby size={32} />}
          radioValue={values.kidReactivity}
          onRadioChange={(value) => setFormValue('kidReactivity', value as Reactivity)}
          textName="kidReactivityNotes"
          textValue={values.kidReactivityNotes ?? ''}
          onTextChange={(value) => setFormValue('kidReactivityNotes', value)}
          radioError={fieldErrors['kidReactivity']}
          textError={fieldErrors['kidReactivityNotes']}
        />
        <ReactivityInput
          label="People"
          icon={<PersonStanding size={32} />}
          radioValue={values.peopleReactivity}
          onRadioChange={(value) => setFormValue('peopleReactivity', value as Reactivity)}
          textName="peopleReactivityNotes"
          textValue={values.peopleReactivityNotes ?? ''}
          onTextChange={(value) => setFormValue('peopleReactivityNotes', value)}
          radioError={fieldErrors['peopleReactivity']}
          textError={fieldErrors['peopleReactivityNotes']}
        />
        <Button
          type="submit" 
          disabled={isPending}
          size="lg"
          m="0 4rem"
        >
          Save
        </Button>
      </form>
    </div>
  )
}
