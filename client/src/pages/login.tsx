import { ErrorBanner } from '@/components/forms/errorBanner'
import { useNavigate } from 'react-router'
import { useAuth } from '@/context/auth'
import { useLogin } from '@/api/users'
import { ApiError } from '@/api/errors'
import { PasswordInput, TextInput, Button } from '@mantine/core'
import { useFormValidation } from '@/hooks/useFormValidation'
import { z } from 'zod'
import './login.scss'

const loginSchema = z.object({
  email: z.string({ message: 'Email is required' }).email({ message: 'Please enter a valid email'}),
  password: z.string({ message: 'Password is required'}).min(8, { message: 'Password must be at least 8 characters' }),
})

type LoginFormState = z.infer<typeof loginSchema>

const emptyFormState = {
  email: '',
  password: '',
} as const

export function Login() {
  const { 
      values,
      fieldErrors, 
      setFieldErrors,
      formError,
      setFormError,
      setFormValue,
      validate,
    } = useFormValidation<LoginFormState, typeof loginSchema>(emptyFormState, loginSchema)
  const { mutateAsync: loginUser, isPending } = useLogin()
  const { setAuth } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const result = validate()
    if (!result.success) return

    setFormError(null)
    try {
      const { authToken, user } = await loginUser(result.data)
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
    <div className="login">
      <ErrorBanner message={formError} />
      <h1 className="login__header">Log in</h1>
      <form className="login__form" onSubmit={handleSubmit}>
        <TextInput 
          name="email" 
          label="Email" 
          value={values.email} 
          onChange={(e) => setFormValue('email', (e.target.value))} 
          error={fieldErrors.email}
          size="lg" 
          w="100%"
        />
        <PasswordInput 
          name="password"
          label="Password" 
          value={values.password} 
          onChange={(e) => setFormValue('password', e.target.value)} 
          error={fieldErrors.password}
          size="lg" 
          w="100%"
        />
        <Button
          type="submit"
          disabled={isPending}
          size="lg"
          fullWidth
        >
          {isPending ? 'Logging in...' : 'Log in'}
        </Button>
      </form>
    </div>
  )
}
