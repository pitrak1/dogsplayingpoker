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
// import { z } from 'zod'

// const sizeValues = ['toy', 'small', 'medium', 'large', 'giant']
// const reactivityValues = ['none', 'mixed', 'strong']
// const createPetSchema = z.object({
//   name: z.string().min(2, 'Pet name must be at least 2 characters').max(30),
//   age: z.number().int().positive(),
//   breed: z.string().min(3, 'Breed name must be at least 3 characters').max(30),
//   pictureUrl: z.string().nullable(),
//   size: z.enum(sizeValues),
//   dogReactivity: z.enum(reactivityValues),
//   dogReactivityNotes: z.string().nullable(),
//   catReactivity: z.enum(reactivityValues),
//   catReactivityNotes: z.string().nullable(),
//   kidReactivity: z.enum(reactivityValues),
//   kidReactivityNotes: z.string().nullable(),
//   peopleReactivity: z.enum(reactivityValues),
//   peopleReactivityNotes: z.string().nullable(),
// })

export function ProfileEditPetsAdd() {
  const [name, setName] = useState<string | null>(null)
  const [age, setAge] = useState<number | null>(null)
  const [breed, setBreed] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [size, setSize] = useState<Size>('unknown')
  const [dogReactivity, setDogReactivity] = useState<Reactivity>('unknown')
  const [dogReactivityNotes, setDogReactivityNotes] = useState<string | null>(null)
  const [catReactivity, setCatReactivity] = useState<Reactivity>('unknown')
  const [catReactivityNotes, setCatReactivityNotes] = useState<string | null>(null)
  const [kidReactivity, setKidReactivity] = useState<Reactivity>('unknown')
  const [kidReactivityNotes, setKidReactivityNotes] = useState<string | null>(null)
  const [peopleReactivity, setPeopleReactivity] = useState<Reactivity>('unknown')
  const [peopleReactivityNotes, setPeopleReactivityNotes] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  // const { mutateAsync: createPet, isPending } = useCreatePet()

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

  // const validate = () => {
  //   const result = createPetSchema.safeParse(values)
  //   if (!result.success) {
  //     const fieldErrors: Record<string, string> = {}
  //     result.error.issues.forEach((issue) => {
  //       const field = issue.path[0]?.toString()
  //       if (field && !fieldErrors[field]) fieldErrors[field] = issue.message
  //     })
  //     setErrors(fieldErrors)
  //     return false
  //   }
  //   setErrors({})
  //   return true
  // }

  // useEffect(() => {
  //   return () => {
  //     if (previewUrl) URL.revokeObjectURL(previewUrl ?? '')
  //   }
  // }, [previewUrl])

  const onPictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null
    setFile(file)
    setPreviewUrl(file ? URL.createObjectURL(file) : null)
    e.target.value = ''
  }

  const handleSizeChange = (value: string) => {
    setSize(value as Size)
  }

  const handleDogReactivityChange = (value: string) => {
    setDogReactivity(value as Reactivity)
  }

  const handleCatReactivityChange = (value: string) => {
    setCatReactivity(value as Reactivity)
  }

  const handleKidReactivityChange = (value: string) => {
    setKidReactivity(value as Reactivity)
  }

  const handlePeopleReactivityChange = (value: string) => {
    setPeopleReactivity(value as Reactivity)
  }

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    // e.preventDefault()
    // setFormError(null)
    
    // let pictureUrl: string | undefined = undefined
    // if (file) {
    //   try {
    //     pictureUrl = await uploadImage(file)
    //   } catch (err) {
    //     if (err instanceof ApiError) {
    //       setFormError(err.message)
    //     }
    //   }
    // }

    // if (!name || !age || !breed) {
    //   setFormError('Required fields not given')
    //   return
    // }

    // try {
    //   await createPet({
    //     name,
    //     age,
    //     size,
    //     breed,
    //     pictureUrl,
    //     dogReactivity,
    //     dogReactivityNotes,
    //     catReactivity,
    //     catReactivityNotes,
    //     kidReactivity,
    //     kidReactivityNotes,
    //     peopleReactivity,
    //     peopleReactivityNotes
    //   })
    //   // setAuthUser(updatedUser)
    //   setFile(null)
    //   setPreviewUrl(null)
    // } catch (err) {
    //   if (err instanceof ApiError) {
    //     setFormError(err.message)
    //   }
    // }
  }

  return (
    <div className="settings-block profile-edit-pets-add">
      <ErrorBanner message={formError} />
      <h3 className="settings-block-title">Add a new pet</h3>
      <div className="profile-edit-pets-add__field">
        <label className="settings-field-name" htmlFor="name">Name</label>
        <input
            type="text"
            className="settings-text-input"
            id="name"
            name="name"
            value={name ?? ''}
            onChange={(e) => setName(e.target.value)}
          />
      </div>
      <div className="profile-edit-pets-add__field">
        <label className="settings-field-name" htmlFor="age">Age</label>
        <input
            type="text"
            className="settings-text-input"
            id="age"
            name="age"
            value={age ?? ''}
            onChange={(e) => setAge(Number(e.target.value))}
          />
      </div>
      <div className="profile-edit-pets-add__field">
        <label className="settings-field-name" htmlFor="breed">Breed</label>
        <input
            type="text"
            className="settings-text-input"
            id="breed"
            name="breed"
            value={breed ?? ''}
            onChange={(e) => setBreed(e.target.value)}
          />
      </div>
      <div className="profile-edit-pets-add__field">
        <label className="settings-field-name" htmlFor="picture">Upload a picture</label>
        <img
          src={previewUrl ?? undefined}
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
          value={size}
          onChange={handleSizeChange}
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
            value={dogReactivity}
            onChange={handleDogReactivityChange}
            fields={reactivityRadioFields}
          />
        </div>
        <textarea
          rows={2}
          disabled={dogReactivity === 'unknown'}
          className="settings-text-input profile-edit-pets-add__reactivity-notes"
          id="dogReactivityNotes"
          name="dogReactivityNotes"
          value={dogReactivityNotes ?? ''}
          onChange={(e) => setDogReactivityNotes(e.target.value)}
        />
      </div>
      <div className="profile-edit-pets-add__field">
        <div className="profile-edit-pets-add__radio-group">
          <label className="settings-field-name profile-edit-pets-add__radio-label" htmlFor="catReactivity"><Cat size={28}/>Cats</label>
          <RadioButtonGroup
            name="catReactivity"
            value={catReactivity}
            onChange={handleCatReactivityChange}
            fields={reactivityRadioFields}
          />
        </div>
        <textarea
          rows={2}
          disabled={catReactivity === 'unknown'}
          className="settings-text-input profile-edit-pets-add__reactivity-notes"
          id="catReactivityNotes"
          name="catReactivityNotes"
          value={catReactivityNotes ?? ''}
          onChange={(e) => setCatReactivityNotes(e.target.value)}
        />
      </div>
      <div className="profile-edit-pets-add__field">
        <div className="profile-edit-pets-add__radio-group">
          <label className="settings-field-name profile-edit-pets-add__radio-label" htmlFor="kidReactivity"><Baby size={28}/>Kids</label>
          <RadioButtonGroup
            name="kidReactivity"
            value={kidReactivity}
            onChange={handleKidReactivityChange}
            fields={reactivityRadioFields}
          />
        </div>
        <textarea
          rows={2}
          disabled={kidReactivity === 'unknown'}
          className="settings-text-input profile-edit-pets-add__reactivity-notes"
          id="kidReactivityNotes"
          name="kidReactivityNotes"
          value={kidReactivityNotes ?? ''}
          onChange={(e) => setKidReactivityNotes(e.target.value)}
        />
      </div>
      <div className="profile-edit-pets-add__field">
        <div className="profile-edit-pets-add__radio-group">
          <label className="settings-field-name profile-edit-pets-add__radio-label" htmlFor="peopleReactivity"><PersonStanding size={28}/>People</label>
          <RadioButtonGroup
            name="peopleReactivity"
            value={peopleReactivity}
            onChange={handlePeopleReactivityChange}
            fields={reactivityRadioFields}
          />
        </div>
        <textarea
          rows={2}
          disabled={peopleReactivity === 'unknown'}
          className="settings-text-input profile-edit-pets-add__reactivity-notes"
          id="peopleReactivityNotes"
          name="peopleReactivityNotes"
          value={peopleReactivityNotes ?? ''}
          onChange={(e) => setPeopleReactivityNotes(e.target.value)}
        />
      </div>
      <button type="submit" className="primary-button profile-edit-pets-add__save-button" onClick={handleSave}>Save</button>
    </div>
  )
}
