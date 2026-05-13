import { FormField } from '@/components/forms/formField'
import { useState } from 'react'
import { CREATE_USER } from '@/pages/signup.queries'
import { AuthPayload } from '@/types/authPayload'
import { useMutation } from '@apollo/client'
import { useNavigate } from 'react-router'
import { useAuth } from '@/context/auth'
import './signup.scss'

export function Signup() {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [createUser, { loading, error }] = useMutation<{ createUser: AuthPayload }>(CREATE_USER, { errorPolicy: 'all' })

  const isValid = email.includes('@') && username && password.length >= 8 && password == confirmPassword
  const isDisabled = !isValid || loading

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
    const response = await createUser({ variables: { username, email, password }})
    if (response.data) {
      const authToken = response.data?.createUser?.authToken!
      const user = response.data?.createUser?.user
      setAuth(authToken, user)
      navigate('/', { replace: true })
    } else {
      console.log(response.errors)
    }
  }

  return (
    <div className="signup">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <FormField name="email" label="Email" type="email" value={email} onChange={onChangeEmail}/>
        <FormField name="username" label="Username" type="text" value={username} onChange={onChangeUsername}/>
        <FormField name="password" label="Password" type="password" value={password} onChange={onChangePassword}/>
        <FormField name="confirmPassword" label="Confirm Password" type="password" value={confirmPassword} onChange={onChangeConfirmPassword}/>
        <button type="submit" disabled={isDisabled}>
          {loading ? 'Signing up...' : 'Sign up'}
        </button>
      </form>
    </div>
  )
}
