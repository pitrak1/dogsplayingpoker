import './radioButtonGroup.scss'

type Props = {
  name: string
  value: string
  onChange: (value: string) => void
  // This is a map from the field name to label ('small' to 'Small (10 - 35 lbs)')
  fields: Record<string, string>
  ariaLabel: string
}

export function RadioButtonGroup({ name, value, onChange, fields, ariaLabel }: Props) {
  const fieldElements = Object.entries(fields).map(([k, v]) => (
    <label key={`${name}-${k}`} className="radio-button-group__input-label">
      {v}
      <input
        type="radio"
        className="radio-button-group__input"
        id={`${name}-${k}`}
        name={name}
        checked={value === k}
        onChange={() => onChange(k)}
      />
    </label>
  ))


  return (
    <div className="radio-button-group" role="radiogroup" aria-label={ariaLabel}>
      {fieldElements}
    </div>
  )
}
