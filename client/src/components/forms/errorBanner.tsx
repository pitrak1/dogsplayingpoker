import { Alert } from '@mantine/core'
import { CircleX } from 'lucide-react'

export function ErrorBanner({ message }: { message: string | null }) {
  if (!message) return

  return (
    <Alert color="red" title="Error" icon={<CircleX />} w="400">
      {message}
    </Alert>
  )
}
