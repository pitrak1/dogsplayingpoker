import { FormField } from '@/components/forms/formField'
import { ErrorBanner } from '@/components/forms/errorBanner'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '@/context/auth'
import { useLogin } from '@/api/users'
import { ApiError } from '@/api/errors'
import './login.scss'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  const { mutateAsync: loginUser, isPending, error } = useLogin()

  const { setAuth } = useAuth()

  const isValid = email && password
  const isDisabled = !isValid || isPending

  const navigate = useNavigate()

  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()
    try {
      const { authToken, user } = await loginUser({ email, password })
      setAuth(authToken, user)
      navigate('/', { replace: true })
    } catch (err) {
      if (err instanceof ApiError) {
        setFormError(err.message)
      }
    }
  }

  return (
    <div className="login">
      <ErrorBanner message={formError} />
      <h1>Log in</h1>
      <form onSubmit={handleSubmit}>
        <FormField name="email" label="Email" type="email" value={email} onChange={onChangeEmail} />
        <FormField
          name="password"
          label="Password"
          type="password"
          value={password}
          onChange={onChangePassword}
        />
        <button type="submit" disabled={isDisabled}>
          {isPending ? 'Logging in...' : 'Log in'}
        </button>
      </form>
    </div>
  )
}
