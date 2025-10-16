import * as yup from 'yup'

export const reviewFormSchema = yup.object({
    message: yup.string().required('Your message is required'),
    rating: yup.number().required()
});