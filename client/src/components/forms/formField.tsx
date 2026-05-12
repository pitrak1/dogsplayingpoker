import './formField.scss'

type Props = {
  name: string
  label: string
  type: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function FormField({name, label, type, value, onChange}: Props) {
  return (
    <div className="form-field">
      <label htmlFor={name}>{label}</label>
      <input id={name} type={type} value={value} onChange={onChange} />
    </div>
  )
}
