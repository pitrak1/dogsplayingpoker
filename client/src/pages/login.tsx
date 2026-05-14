import { FormField } from '@/components/forms/formField'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { LOGIN_USER } from '@/pages/login.queries'
import { AuthPayload } from '@/types/authPayload'
import { useMutation } from '@apollo/client'
import { useAuth } from '@/context/auth'
import './login.scss'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [loginUser, { loading, error }] = useMutation<{ loginUser: AuthPayload }>(LOGIN_USER, {
    errorPolicy: 'all',
  })

  const { setAuth } = useAuth()

  const isValid = email && password
  const isDisabled = !isValid || loading

  const navigate = useNavigate()

  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()
    const response = await loginUser({ variables: { email, password } })
    if (response.data) {
      const authToken = response.data?.loginUser?.authToken!
      const user = response.data?.loginUser?.user
      setAuth(authToken, user)
      navigate('/', { replace: true })
    } else {
      console.log(response.errors)
    }
  }

  return (
    <div className="login">
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
          {loading ? 'Logging in...' : 'Log in'}
        </button>
      </form>
    </div>
  )
}
