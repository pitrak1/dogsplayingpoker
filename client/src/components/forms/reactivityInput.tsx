import { RadioButtonGroup } from '@/components/forms/radioButtonGroup'
import { reactivitySchema } from 'dogsplayingpoker-shared/schemas/pet'
import { z } from 'zod'
import './reactivityInput.scss'

type Props = {
  label: string
  icon?: React.ReactNode
  radioName: string
  radioValue: z.infer<typeof reactivitySchema> | null
  onRadioChange: (e: z.infer<typeof reactivitySchema>) => void
  radioError?: string | null
  textName: string
  textValue: string
  onTextChange: (value: string) => void
  textError?: string | null
}

const reactivityRadioFields = {
  unknown: 'Unknown',
  none: 'None',
  mixed: 'Mixed',
  strong: 'Strong',
}

export function ReactivityInput({
  label,
  icon,
  radioName, 
  radioValue, 
  onRadioChange,
  radioError,
  textName,
  textValue,
  onTextChange,
  textError
}: Props) {
  return (
    <div className="reactivity-input">
      <div className="reactivity-input__radio-group">
        <label
          className="settings-field-name reactivity-input__label" 
          htmlFor={radioName}
        >
          {icon}
          {label}
        </label>
        <RadioButtonGroup
          name={radioName}
          value={radioValue ?? 'unknown'}
          onChange={(value) => onRadioChange(value as z.infer<typeof reactivitySchema>)}
          fields={reactivityRadioFields}
        />
        {radioError && <span className="reactivity-input__error-text">{radioError}</span>}
      </div>
      <textarea
        rows={2}
        className="settings-text-input reactivity-input__notes"
        id={textName}
        name={textName}
        value={textValue}
        onChange={(e) => onTextChange(e.target.value)}
      />
      {textError && <span className="reactivity-input__error-text">{textError}</span>}
    </div>
  )
}
