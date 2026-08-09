import './formField.scss'

type Props = {
  name: string
  label: string
  description?: string | null
  error?: string | null
  icon?: React.ReactNode
  children: React.ReactNode
}

export function FormField({
  name, 
  label,
  description,
  error,
  icon,
  children 
}: Props) {
  return (
    <div className="form-field">
      <label
        className="form-field__label"
        htmlFor={name} 
      >
        {icon}
        {label}
      </label>
      {description && <span className="form-field__description">{description}</span>}
      {children}
      {error && <span className="form-field__error-text">{error}</span>}
    </div>
  )
}
