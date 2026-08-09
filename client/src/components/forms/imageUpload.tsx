import { Button } from '@mantine/core'

type Props = {
  name: string
  label: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function ImageUpload({ name, label, onChange }: Props) {
  return (
    <div>
      <Button component="label" htmlFor={name} size="lg">{label}</Button>
      <input style={{ display: 'none' }} id={name} type="file" accept="image/*" onChange={onChange} />
    </div>
  )
}
