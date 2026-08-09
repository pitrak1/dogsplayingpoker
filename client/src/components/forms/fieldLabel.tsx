import React from 'react'
import './fieldLabel.scss'

type Props = {
  label: string
  description?: string | null
  name: string
  children: React.ReactNode
}

export function FieldLabel({ name, label, description, children }: Props) {
  return (
    <div className="field-label">
      <label className="field-label__label" htmlFor={name}>{label}</label>
      {description && <small className="field-label__description">
        {description}
      </small>}
      {children}
    </div>
  )
}
