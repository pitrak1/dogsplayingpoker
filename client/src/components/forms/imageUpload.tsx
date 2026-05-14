import './imageUpload.scss'

type Props = {
  name: string
  label: string
  value: File | null
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function ImageUpload({ name, label, value, onChange }: Props) {
  return (
    <div className="image-upload">
      <label htmlFor={name} className="image-upload__button">{label}</label>
      <input id={name} type="file" accept="image/*" onChange={onChange} />
      {value && <span className="image-upload__filename">{value.name}</span>}
    </div>
  )
}
