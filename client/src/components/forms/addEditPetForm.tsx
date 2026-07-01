import React, { useState, useEffect } from 'react'
import { Size } from '@/types/size'
import { Reactivity } from '@/types/reactivity'
import { ImageUpload } from '@/components/forms/imageUpload'
import './addEditPetForm.scss'
import { RadioButtonGroup } from '@/components/forms/radioButtonGroup'
import { Baby, PersonStanding, Dog, Cat, X } from 'lucide-react'
import { uploadImage } from '@/lib/upload'
import { ApiError } from '@/api/errors'
import { ErrorBanner } from '@/components/forms/errorBanner'
import { Pet, createPetSchema, reactivitySchema, sizeSchema } from 'dogsplayingpoker-shared/schemas/pet'
import { useCreatePet } from '@/api/pets'
import { FormField } from '@/components/forms/formField'
import { z } from 'zod'
import { ReactivityInput } from './reactivityInput'

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

type Props = {
  pet?: Pet | null
  onClose?: () => void
}

export function AddEditPetForm({ pet, onClose }: Props) {
  const emptyFormState = {
    size: 'unknown',
    dogReactivity: 'unknown',
    catReactivity: 'unknown',
    kidReactivity: 'unknown',
    peopleReactivity: 'unknown'
  } as const
  const [values, setValues] = useState<PetFormState>(pet ?? emptyFormState)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState<string | null>(null)

  const { mutateAsync: createPet, isPending } = useCreatePet()

  const sizeRadioFields = {
    toy: 'Toy (0 - 10 lbs)',
    small: 'Small (10 - 35 lbs)',
    medium: 'Medium (35 - 55 lbs)',
    large: 'Large (55 - 85 lbs)',
    giant: 'Giant (85+ lbs)'
  }

  useEffect(() => {
    return () => {
      if (values.fileUrl) URL.revokeObjectURL(values.fileUrl ?? '')
    }
  }, [values.fileUrl])

  const setFormValue = <K extends keyof PetFormState>(field: K, value: PetFormState[K]) => {
    setValues((prev) => ({ ...prev, [field]: value }))
  }

  const onPictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null
    setFormValue('file', file)
    setFormValue('fileUrl', file ? URL.createObjectURL(file) : null)
    e.target.value = ''
  }

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const result = createPetSchema.safeParse(values)
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.issues.forEach((issue) => {
        const field = issue.path[0]?.toString()
        if (field && !fieldErrors[field]) fieldErrors[field] = issue.message
      })
      setFieldErrors(fieldErrors)
      console.log(result.error)
      return
    }
    setFieldErrors({})
    
    let pictureUrl: string | undefined = null
    if (values.file) {
      try {
        pictureUrl = await uploadImage(values.file)
      } catch (err) {
        if (err instanceof ApiError) {
          setFormError(err.message)
        }
      }
    }

    try {
      await createPet({ ...result.data, pictureUrl  })
      setFormValue('file', null)
      setFormValue('fileUrl', null)
    } catch (err) {
      if (err instanceof ApiError) {
        setFormError(err.message)
      }
    }
  }

  return (
    <div className="settings-block add-edit-pet-form">
      <ErrorBanner message={formError} />
      <div className="settings-block-header add-edit-pet-form__header">
        <h3 className="settings-block-title add-edit-pet-form__title">
          {pet ? 'Edit Pet' : 'Add a new pet'}
        </h3>
        {onClose && (
          <button className="add-edit-pet-form__close-button" onClick={onClose}>
            <X size={24} />
          </button>
        )}
      </div>
      <form onSubmit={handleSave} className="add-edit-pet-form__form">
        <FormField
          name="name"
          label="Name"
          variant="settings"
          type="text"
          value={values.name ?? ''}
          onChange={(e) => setFormValue('name', e.target.value)}
        />
        <FormField
          name="age"
          label="Age"
          variant="settings"
          type="text"
          value={String(values.age ?? '')}
          onChange={(e) => setFormValue('age', Number(e.target.value))}
        />
        <FormField
          name="breed"
          label="Breed"
          variant="settings"
          type="text"
          value={values.breed ?? ''}
          onChange={(e) => setFormValue('breed', e.target.value)}
        />
        <FormField
          name="picture"
          label="Upload a picture"
          variant="settings"
        >
          <img
            src={values.fileUrl ?? undefined}
            alt="Picture preview"
            className="avatar__profile add-edit-pet-form__preview"
          />
          <div className="add-edit-pet-form__upload-button">
            <ImageUpload name="picture" label="Upload" value={null} onChange={onPictureChange} />
          </div>
        </FormField>
        <FormField
          name="size"
          label="Size"
          variant="settings"
        >
          <RadioButtonGroup
            name="size"
            value={values.size}
            onChange={(value) => setFormValue('size', value as Size)}
            fields={sizeRadioFields}
          />
        </FormField>
        <div className="profile-edit-pets-add__reactivity-header">
          <div className="settings-field-name">Reactivity</div>
          <small className="settings-field-description">You can choose to add notes about your pet's reactivity in the field below each reactivity type.</small>
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
        />
        <button 
          type="submit"
          disabled={isPending}
          className="primary-button profile-edit-pets-add__save-button" 
        >
          Save
        </button>
      </form>
    </div>
  )
}
