import './formField.scss'

type Props = (
  | { 
    type: string, 
    value: string, 
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    children?: never
  }
  | {
    type?: never
    value?: never
    onChange?: never
    children: React.ReactNode
  }
) & {
  name: string
  label: string
  error?: string | null
  variant?: string | null
  icon?: React.ReactNode
}

export function FormField({
  name, 
  label,
  error,
  variant = 'default',
  icon,
  type, 
  value,
  onChange,
  children 
}: Props) {
  return (
    <div className={`form-field--${variant}`}>
      <label
        className={`form-field__label--${variant}`} 
        htmlFor={name} 
      >
        {icon}
        {label}
      </label>
      {children ?? (
        <input 
          className={`form-field__input--${variant}`}
          id={name} 
          name={name} 
          type={type} 
          value={value} 
          onChange={onChange}
        />
      )}
      {error && <span className="form-field__error-text">{error}</span>}
    </div>
  )
}
