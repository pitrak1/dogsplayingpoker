import React, { useState, useEffect } from 'react'
import { Size } from '@/types/size'
import { Reactivity } from '@/types/reactivity'
import { ImageUpload } from '@/components/forms/imageUpload'
import './profileEditPetsAdd.scss'
import { RadioButtonGroup } from '@/components/forms/radioButtonGroup'
import { Baby, PersonStanding, Dog, Cat } from 'lucide-react'
import { uploadImage } from '@/lib/upload'
import { ApiError } from '@/api/errors'
import { ErrorBanner } from '@/components/forms/errorBanner'
import { createPetSchema, reactivitySchema, sizeSchema } from 'dogsplayingpoker-shared/schemas/pet'
import { useCreatePet } from '@/api/pets'
import { z } from 'zod'

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

export function ProfileEditPetsAdd() {
  const [values, setValues] = useState<PetFormState>({
    size: 'unknown',
    dogReactivity: 'unknown',
    catReactivity: 'unknown',
    kidReactivity: 'unknown',
    peopleReactivity: 'unknown'
  })
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

  const reactivityRadioFields = {
    strong: 'Strong',
    mixed: 'Mixed',
    none: 'None'
  }

  useEffect(() => {
    return () => {
      if (values.fileUrl) URL.revokeObjectURL(values.fileUrl ?? '')
    }
  }, [values.fileUrl])

  const setFormValue = <K extends keyof FormState>(field: K, value: FormState[K]) => {
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
      return
    }
    setFieldErrors({})
    
    let pictureUrl: string | null = null
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
      await createPet({ ...result.data, pictureUrl })
      // setAuthUser(updatedUser)
      setFormValue('file', null)
      setFormValue('fileUrl', null)
    } catch (err) {
      if (err instanceof ApiError) {
        setFormError(err.message)
      }
    }
  }

  return (
    <div className="settings-block profile-edit-pets-add">
      <ErrorBanner message={formError} />
      <h3 className="settings-block-title">Add a new pet</h3>
      <form onSubmit={handleSave} className="profile-edit-pets-add__form">
        <div className="profile-edit-pets-add__field">
          <label className="settings-field-name" htmlFor="name">Name</label>
          <input
              type="text"
              className="settings-text-input"
              id="name"
              name="name"
              value={values.name ?? ''}
              onChange={(e) => setFormValue('name', e.target.value)}
            />
        </div>
        <div className="profile-edit-pets-add__field">
          <label className="settings-field-name" htmlFor="age">Age</label>
          <input
              type="text"
              className="settings-text-input"
              id="age"
              name="age"
              value={values.age ?? ''}
              onChange={(e) => setFormValue('age', Number(e.target.value))}
            />
        </div>
        <div className="profile-edit-pets-add__field">
          <label className="settings-field-name" htmlFor="breed">Breed</label>
          <input
              type="text"
              className="settings-text-input"
              id="breed"
              name="breed"
              value={values.breed ?? ''}
              onChange={(e) => setFormValue('breed', e.target.value)}
            />
        </div>
        <div className="profile-edit-pets-add__field">
          <label className="settings-field-name" htmlFor="picture">Upload a picture</label>
          <img
            src={values.fileUrl ?? undefined}
            alt="Picture preview"
            className="avatar__profile profile-edit-pets-add__preview"
          />
          <div className="profile-edit-pets-add__upload-button">
            <ImageUpload name="picture" label="Upload" value={null} onChange={onPictureChange} />
          </div>
        </div>
        <div className="profile-edit-pets-add__field">
          <label className="settings-field-name" htmlFor="size">Size</label>
          <RadioButtonGroup
            name="size"
            value={values.size}
            onChange={(value) => setFormValue('size', value as Size)}
            fields={sizeRadioFields}
          />
        </div>
        <div className="profile-edit-pets-add__reactivity-header">
          <div className="settings-field-name">Reactivity</div>
          <small className="settings-field-description">You can choose to add notes about your pet's reactivity in the field below each reactivity type.</small>
        </div>
        <div className="profile-edit-pets-add__field">
          <div className="profile-edit-pets-add__radio-group">
            <label className="settings-field-name profile-edit-pets-add__radio-label" htmlFor="dogReactivity"><Dog size={28}/>Dogs</label>
            <RadioButtonGroup
              name="dogReactivity"
              value={values.dogReactivity}
              onChange={(value) => setFormValue('dogReactivity', value as Reactivity)}
              fields={reactivityRadioFields}
            />
          </div>
          <textarea
            rows={2}
            className="settings-text-input profile-edit-pets-add__reactivity-notes"
            id="dogReactivityNotes"
            name="dogReactivityNotes"
            value={values.dogReactivityNotes ?? ''}
            onChange={(e) => setFormValue('dogReactivityNotes', e.target.value)}
          />
        </div>
        <div className="profile-edit-pets-add__field">
          <div className="profile-edit-pets-add__radio-group">
            <label className="settings-field-name profile-edit-pets-add__radio-label" htmlFor="catReactivity"><Cat size={28}/>Cats</label>
            <RadioButtonGroup
              name="catReactivity"
              value={values.catReactivity}
              onChange={(value) => setFormValue('catReactivity', value as Reactivity)}
              fields={reactivityRadioFields}
            />
          </div>
          <textarea
            rows={2}
            className="settings-text-input profile-edit-pets-add__reactivity-notes"
            id="catReactivityNotes"
            name="catReactivityNotes"
            value={values.catReactivityNotes ?? ''}
            onChange={(e) => setFormValue('catReactivityNotes', e.target.value)}
          />
        </div>
        <div className="profile-edit-pets-add__field">
          <div className="profile-edit-pets-add__radio-group">
            <label className="settings-field-name profile-edit-pets-add__radio-label" htmlFor="kidReactivity"><Baby size={28}/>Kids</label>
            <RadioButtonGroup
              name="kidReactivity"
              value={values.kidReactivity}
              onChange={(value) => setFormValue('kidReactivity', value as Reactivity)}
              fields={reactivityRadioFields}
            />
          </div>
          <textarea
            rows={2}
            className="settings-text-input profile-edit-pets-add__reactivity-notes"
            id="kidReactivityNotes"
            name="kidReactivityNotes"
            value={values.kidReactivityNotes ?? ''}
            onChange={(e) => setFormValue('kidReactivityNotes', e.target.value)}
          />
        </div>
        <div className="profile-edit-pets-add__field">
          <div className="profile-edit-pets-add__radio-group">
            <label className="settings-field-name profile-edit-pets-add__radio-label" htmlFor="peopleReactivity"><PersonStanding size={28}/>People</label>
            <RadioButtonGroup
              name="peopleReactivity"
              value={values.peopleReactivity}
              onChange={(value) => setFormValue('peopleReactivity', value as Reactivity)}
              fields={reactivityRadioFields}
            />
          </div>
          <textarea
            rows={2}
            className="settings-text-input profile-edit-pets-add__reactivity-notes"
            id="peopleReactivityNotes"
            name="peopleReactivityNotes"
            value={values.peopleReactivityNotes ?? ''}
            onChange={(e) => setFormValue('peopleReactivityNotes', e.target.value)}
          />
        </div>
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
