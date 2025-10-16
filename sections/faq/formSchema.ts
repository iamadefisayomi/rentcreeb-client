import * as yup from 'yup'

export const faqFormSchema = yup.object({
    name: yup.string().required('Name is required'),
    message: yup.string().required('Your message is required'),
    email: yup.string().email('Invalid email format').required('Email is required'),
    phone: yup.string(),
});