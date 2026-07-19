import { ImageUpload } from '@/components/forms/imageUpload'
import './addEditPetForm.scss'
import { RadioButtonGroup } from '@/components/forms/radioButtonGroup'
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
import { getAvatarFallback } from '@/lib/avatar'
import { useFormValidation } from '@/hooks/useFormValidation'

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
  const initialState = pet ?? emptyFormState
  // Because we always submit the whole pet shape, even on edit, we can validate against createPetSchema
  const { 
    values, 
    setValues, 
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

    setValues((prev: PetFormState) => ({ ...prev, file, fileUrl }))

    const result = validate()
    if (!result.success) return
    
    try {
      const pictureUrl = values.file ? await uploadImage(values.file) : null
      if (pet) {
        await editPet({ id: pet.id, input: { ...result.data, pictureUrl }})
      } else {
        await createPet({ ...result.data, pictureUrl  })
      }
      if (onClose) onClose()
    } catch (err) {
      if (err instanceof ApiError) {
        setFormError(err.message)
      }
    }
  }

  const pictureSrc = fileUrl ?? pet?.pictureUrl ?? getAvatarFallback(values.name ?? 'test', 128)

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
            <FormField
              name="name"
              label="Name"
              variant="settings"
              type="text"
              value={values.name ?? ''}
              onChange={(e) => setFormValue('name', e.target.value)}
              error={fieldErrors['name']}
            />
            <FormField
              name="age"
              label="Age"
              variant="settings"
              type="text"
              value={String(values.age ?? '')}
              onChange={(e) => setFormValue('age', Number(e.target.value))}
              error={fieldErrors['age']}
            />
            <FormField
              name="breed"
              label="Breed"
              variant="settings"
              type="text"
              value={values.breed ?? ''}
              onChange={(e) => setFormValue('breed', e.target.value)}
              error={fieldErrors['breed']}
            />
          </div>
          <FormField
            name="picture"
            label="Upload a picture"
            variant="settings"
            error={fieldErrors['picture']}
          >
            <img
              src={pictureSrc}
              alt="Picture preview"
              className="add-edit-pet-form__preview"
            />
            <ImageUpload name="picture" label="Upload" value={null} onChange={onPictureChange} />
          </FormField>
        </div>
        <FormField
          name="size"
          label="Size"
          variant="settings"
          error={fieldErrors['size']}
        >
          <RadioButtonGroup
            name="size"
            value={values.size}
            onChange={(value) => setFormValue('size', value as Size)}
            fields={displaySizeMap}
            ariaLabel='size'
          />
        </FormField>
        <div>
          <div className="add-edit-pet-form__reactivity-header">Reactivity</div>
          <small className="add-edit-pet-form__reactivity-subtitle">You can choose to add notes about your pet's reactivity in the field below each reactivity type.</small>
        </div>
        <ReactivityInput
          label="Dogs"
          icon={<Dog size={32} />}
          radioName="dogReactivity"
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
          radioName="catReactivity"
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
          radioName="kidReactivity"
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
          radioName="peopleReactivity"
          radioValue={values.peopleReactivity}
          onRadioChange={(value) => setFormValue('peopleReactivity', value as Reactivity)}
          textName="peopleReactivityNotes"
          textValue={values.peopleReactivityNotes ?? ''}
          onTextChange={(value) => setFormValue('peopleReactivityNotes', value)}
          radioError={fieldErrors['peopleReactivity']}
          textError={fieldErrors['peopleReactivityNotes']}
        />
        <div className="add-edit-pet-form__save-button-wrapper">
          <button 
            type="submit"
            disabled={isPending}
            className="add-edit-pet-form__save-button" 
          >
            Save
          </button>
        </div>
      </form>
    </div>
  )
}
