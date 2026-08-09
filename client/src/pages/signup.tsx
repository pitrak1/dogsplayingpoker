import { useNavigate } from 'react-router'
import { useAuth } from '@/context/auth'
import { useRegister } from '@/api/users'
import { ApiError } from '@/api/errors'
import { ErrorBanner } from '@/components/forms/errorBanner'
import { useFormValidation } from '@/hooks/useFormValidation'
import { z } from 'zod'
import { TextInput, PasswordInput, Button } from '@mantine/core'
import './signup.scss'

const signupSchema = z.object({
  username: z.string({ message: 'Username is required' }),
  email: z.string({ message: 'Email is required' }).email({ message: 'Please enter a valid email'}),
  password: z.string({ message: 'Password is required'}).min(8, { message: 'Password must be at least 8 characters' }),
  confirmPassword: z.string({ message: 'Confirm password is required'})
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  }
)

type SignupFormState = z.infer<typeof signupSchema>

const emptyFormState = {
  email: '',
  username: '',
  password: '',
  confirmPassword: '',
} as const

export function Signup() {
  const { 
    values,
    fieldErrors, 
    setFieldErrors,
    formError,
    setFormError,
    setFormValue,
    validate,
  } = useFormValidation<SignupFormState, typeof signupSchema>(emptyFormState, signupSchema)
  const { mutateAsync: createUser, isPending } = useRegister()
  const { setAuth } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const result = validate()
    if (!result.success) return

    try {
      const { confirmPassword: _confirmPassword, ...otherValues } = result.data
      const { authToken, user } = await createUser(otherValues)
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
        <TextInput 
          name="email" 
          label="Email" 
          value={values.email} 
          onChange={(e) => setFormValue('email', e.target.value)} 
          size="lg" 
          w="100%"
          error={fieldErrors['email']}
        />
        <p>
          Although you use your email to sign in, your email will NOT be visible to other users.
        </p>
        <TextInput 
          name="username" 
          label="Username" 
          value={values.username} 
          onChange={(e) => setFormValue('username', e.target.value)} 
          size="lg" 
          w="100%"
          error={fieldErrors['username']}
        />
        <PasswordInput 
          name="password" 
          label="Password" 
          value={values.password} 
          onChange={(e) => setFormValue('password', e.target.value)} 
          size="lg" 
          w="100%"
          error={fieldErrors['password']}
        />
        <PasswordInput 
          name="confirmPassword" 
          label="Confirm Password" 
          value={values.confirmPassword} 
          onChange={(e) => setFormValue('confirmPassword', e.target.value)} 
          size="lg" 
          w="100%"
          error={fieldErrors['confirmPassword']}
        />
        <p>
          To personalize your profile with photos and information about your pets, go to the user
          menu after signup and choose the "Your profile" option.
        </p>
        <Button type="submit" disabled={isPending} size="lg" fullWidth>
          {isPending ? 'Signing up...' : 'Sign up'}
        </Button>
      </form>
    </div>
  )
}
