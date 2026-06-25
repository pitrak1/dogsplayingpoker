import { FormField } from '@/components/forms/formField'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '@/context/auth'
import { useRegister } from '@/api/users'
import { ApiError } from '@/api/errors'
import { ErrorBanner } from '@/components/forms/errorBanner'
import './signup.scss'

export function Signup() {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState<string | null>(null)

  const { mutateAsync: createUser, isPending } = useRegister()

  const isValid =
    email.includes('@') && username && password.length >= 8 && password === confirmPassword
  const isDisabled = !isValid || isPending
  const confirmPasswordError = confirmPassword.length > 0 && password !== confirmPassword ? 'Passwords do not match' : null

  const { setAuth } = useAuth()

  const navigate = useNavigate()

  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const onChangeUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value)
  }

  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const onChangeConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFieldErrors({})
    setFormError(null)
    try {
      const { authToken, user } = await createUser({ username, email, password })
      setAuth(authToken, user)
      navigate('/', { replace: true })
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.field) {
          setFieldErrors({ [err.field]: err.message })
        } else {
          setFormError(err.message)
        }
      }
    }
  }

  return (
    <div className="signup">
      <ErrorBanner message={formError} />
      <h1 className="signup__header">Sign Up</h1>
      <form onSubmit={handleSubmit} className="signup__form">
        <FormField 
          name="email" 
          label="Email" 
          type="email" 
          value={email}
          error={fieldErrors['email']}
          onChange={onChangeEmail} 
        />
        <div>
          Although you use your email to sign in, your email will NOT be visible to other users.
        </div>
        <FormField
          name="username"
          label="Username"
          type="text"
          value={username}
          error={fieldErrors['username']}
          onChange={onChangeUsername}
        />
        <FormField
          name="password"
          label="Password"
          type="password"
          value={password}
          error={fieldErrors['password']}
          onChange={onChangePassword}
        />
        <FormField
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          error={confirmPasswordError}
          onChange={onChangeConfirmPassword}
        />
        <div>
          To personalize your profile with photos and information about your pets, go to the user
          menu after signup and choose the "Your profile" option.
        </div>
        <button type="submit" disabled={isDisabled} className="signup__button">
          {isPending ? 'Signing up...' : 'Sign up'}
        </button>
      </form>
    </div>
  )
}
