import { RadioButtonGroup } from '@/components/forms/radioButtonGroup'
import { reactivity, displayReactivityMap } from 'dogsplayingpoker-shared/pet'
import './reactivityInput.scss'

type Props = {
  label: string
  icon?: React.ReactNode
  radioName: string
  radioValue: reactivity | null
  onRadioChange: (e: reactivity) => void
  radioError?: string | null
  textName: string
  textValue: string
  onTextChange: (value: string) => void
  textError?: string | null
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
          className="reactivity-input__label" 
          htmlFor={radioName}
        >
          {icon}
          {label}
        </label>
        <RadioButtonGroup
          name={radioName}
          value={radioValue ?? 'unknown'}
          onChange={(value) => onRadioChange(value as reactivity)}
          fields={displayReactivityMap}
          ariaLabel={label}
        />
        {radioError && <span className="reactivity-input__error-text">{radioError}</span>}
      </div>
      <textarea
        rows={2}
        className="reactivity-input__notes"
        id={textName}
        name={textName}
        value={textValue}
        onChange={(e) => onTextChange(e.target.value)}
      />
      {textError && <span className="reactivity-input__error-text">{textError}</span>}
    </div>
  )
}
