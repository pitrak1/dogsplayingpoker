import { useEffect, useState } from 'react'

export function useImageInput(initialUrl?: string | null) {
  const [file, setFile] = useState<File | null>(null)
  const [fileUrl, setFileUrl] = useState<string | null>(initialUrl ?? null)

  useEffect(() => {
    return () => { if (fileUrl) URL.revokeObjectURL(fileUrl) }
  }, [fileUrl])

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    setFile(file)
    setFileUrl(file ? URL.createObjectURL(file) : null)
    e.target.value = ''
  }

  return { file, fileUrl, onChange }
}