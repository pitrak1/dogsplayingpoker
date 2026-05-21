import { FormField } from '@/components/forms/formField'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '@/context/auth'
import { useRegister } from '@/api/users'
import './signup.scss'

export function Signup() {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [profileImage, setProfileImage] = useState<File | null>(null)

  const { mutateAsync: createUser, isPending, error } = useRegister()

  const isValid =
    email.includes('@') && username && password.length >= 8 && password == confirmPassword
  const isDisabled = !isValid || isPending

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

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()
    try {
      const { authToken, user } = await createUser({ username, email, password })
      setAuth(authToken, user)
      navigate('/', { replace: true })
    } catch (err) {
      console.error('Signup failed:', err)
    }
  }

  return (
    <div className="signup">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <FormField name="email" label="Email" type="email" value={email} onChange={onChangeEmail} />
        <FormField
          name="username"
          label="Username"
          type="text"
          value={username}
          onChange={onChangeUsername}
        />
        <FormField
          name="password"
          label="Password"
          type="password"
          value={password}
          onChange={onChangePassword}
        />
        <FormField
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={onChangeConfirmPassword}
        />
        <div>Although you use your email to sign in, your email will NOT be visible to other users.</div>
        <div>To personalize your profile with photos and information about your pets, go to the user menu after signup and choose the "Your profile" option.</div>
        <button type="submit" disabled={isDisabled}>
          {isPending ? 'Signing up...' : 'Sign up'}
        </button>
      </form>
    </div>
  )
}
