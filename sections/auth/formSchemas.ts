import * as yup from 'yup'

export const signinSchema = yup.object({
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().required('Password is required').min(6, 'Password must be at least 8 characters'),
  remember: yup.boolean().default(false),
});

export const signupSchema = yup.object({
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),

  fullName: yup
    .string()
    .min(2, "A minimum of 2 characters is required for first name")
    .max(50, 'Maximum of 20 characters')
    .required('First name is required'),
  username: yup
    .string()
    .min(2, "A minimum of 2 characters is required for username")
    .max(20, 'Maximum of 20 characters')
    .required('Username is required'),

  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters'),
});

export const resetPasswordSchema = yup.object({
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters'),
  newPassword: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters'),
});