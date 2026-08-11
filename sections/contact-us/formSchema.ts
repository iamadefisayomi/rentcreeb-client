import * as yup from 'yup'

export const contactFormSchema = yup.object({
    name: yup.string().required('Name is required'),
    message: yup.string().required('Your message is required'),
    email: yup.string().email('Invalid email format').required('Email is required'),
    desiredDate: yup.string().optional(),
    desiredTime: yup.string().optional()
});


export const waitListFormSchema = yup.object({
    name: yup.string().required('Name is required'),
    phone: yup.string().required('Phone number is required'),
    message: yup.string().optional(),
    email: yup.string().email('Invalid email format').required('Email is required'),
    state: yup.string().trim().nullable(),
    lga: yup.string().trim().nullable(),
    city: yup.string().trim().nullable(),
    iAm: yup
  .string()
  .required("Please select who you are"),
    interest: yup
  .array()
  .of(yup.string().required())
  .min(1, "Select at least one area of interest")
  .required(),
    location: yup
        .object({
          type: yup.string().oneOf(["Point"]).nullable(),
          coordinates: yup
            .array()
            .of(yup.number())
            .test(
              "valid-coords",
              "Must have [longitude, latitude]",
              (val) => !val || val.length === 0 || val.length === 2
            )
            .nullable(),
        })
        .nullable(),
});