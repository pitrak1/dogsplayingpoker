import { FormField } from '@/components/forms/formField'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '@/context/auth'
import { useLogin } from '@/api/users'
import './errorBanner.scss'

export function ErrorBanner({ message }: { message: string | null }) {
  const showBanner = !!message

  return (
    <div className={`error-banner ${showBanner && 'visible'}`}>
      {message}
    </div>
  )
}
