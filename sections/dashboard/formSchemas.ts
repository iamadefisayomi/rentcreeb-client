import { _propertyStatus, _propertyTypes, _listedIn } from '@/_data/_propertyDefault';
import { getAllowedKeysAndType } from '@/utils/getAllowedKeysAndType';
import * as yup from 'yup'


export const extractSchemaKeys = (schema: yup.ObjectSchema<any>): string[] => {
  return Object.keys(schema.fields);
};



export const changePasswordFormSchema = yup.object({
    oldPassword: yup.string().required('Old Password is required').min(6, 'Password must be at least 6 characters'),
    password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
    confirmPassword: yup.string()
        .oneOf([yup.ref('password'), undefined], 'Passwords must match')
        .nullable()
        .required('Confirm Password is required')
});

export const socialsFormSchema = yup.object({
    facebook: yup.string().url().optional(),
    linkedin: yup.string().url().optional(),
    instagram: yup.string().url().optional(),
    twitter: yup.string().url().optional(),
});
export type SocialsType = yup.InferType<typeof socialsFormSchema>;
export const socialAllowedKeys = getAllowedKeysAndType(socialsFormSchema)

const phoneRegExp = /^[+\d]?(?:[\d-.\s()]*)$/;
export const accountInformationSchema = yup.object().shape({
    firstName: yup.string().required('First name is required').trim().min(1, 'First name cannot be empty'),
    lastName: yup.string().required('Last name is required').trim().min(1, 'Last name cannot be empty'),
    username: yup.string().nullable().trim(),
    gender: yup.string().oneOf(["male", 'female']),
    email: yup.string().email('Must be a valid email').required('Email is required').trim(),
    phone: yup
    .string()
    .optional()
    .matches(phoneRegExp, 'Invalid phone number')
    .nullable()
    .transform(value => (value === '' ? null : value)),

  whatsapp: yup
    .string()
    .optional()
    .matches(phoneRegExp, 'Invalid WhatsApp number')
    .nullable()
    .transform(value => (value === '' ? null : value)),
  });

  export type AccountinformationType = yup.InferType<typeof accountInformationSchema>


  export const professionalDetailsSchema = yup.object().shape({
    experience: yup
      .string()
      .optional(),
    specialization: yup
      .string()
      .optional(),
    bio: yup
      .string()
      .optional(),
  
    address: yup
      .string()
      .optional(),
    agency: yup.string().optional().trim(),
    license: yup
      .string()
      .trim()
  });

export type ProfessionalDetailType = yup.InferType<typeof professionalDetailsSchema>;
export const professionalDetailKeys = getAllowedKeysAndType<yup.InferType<typeof professionalDetailsSchema>>(professionalDetailsSchema)

export const notificationsSchema = yup.object().shape({
    getNews: yup.boolean().default(Math.random() < 0.5),
    getAccountUpdate: yup.boolean().default(Math.random() < 0.5),
    getClientEmail: yup.boolean().default(Math.random() < 0.5),
    getMeetupNews: yup.boolean().default(Math.random() < 0.5),
    getListingUpdates: yup.boolean().default(Math.random() < 0.5),
    getInquiryNotification: yup.boolean().default(Math.random() < 0.5),
    getCommentNotification: yup.boolean().default(Math.random() < 0.5),
    getMentionNotification: yup.boolean().default(Math.random() < 0.5),
    getExpiryNotification: yup.boolean().default(Math.random() < 0.5),
    getScheduleNotification: yup.boolean().default(Math.random() < 0.5),
    getBookmarkNotification: yup.boolean().default(Math.random() < 0.5),
    getMarketInsight: yup.boolean().default(Math.random() < 0.5),
    getOpportunity: yup.boolean().default(Math.random() < 0.5),
    getInsiderNews: yup.boolean().default(Math.random() < 0.5),
    getInspirations: yup.boolean().default(Math.random() < 0.5),
})

export type NotificationType = yup.InferType<typeof notificationsSchema>;
export const notificationAllowedKeys = getAllowedKeysAndType(notificationsSchema)

// New propety schema 
export const newPropertySchema = yup.object().shape({
  // Core Info
  title: yup.string().required('Property title is required').trim().min(6),
  description: yup.string().required('Property description is required').trim().min(20),
  type: yup.string().required('Property type is required').default(_propertyTypes.all),
  listedIn: yup.string().required('Listed in is required'),
  status: yup.string().required().default('Available'),

  // Pricing & Features
  price: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === null ? undefined : value
    )
    .typeError("Price must be a number")
    .required("Property price is required"),
  taxRate: yup.number().typeError('Tax rate must be a number').nullable().default(0),

  bedrooms: yup.number().typeError('Bedrooms must be a number').required('Number of bedrooms is required').default(1),
  bathrooms: yup.number().typeError('Bathrooms must be a number').required('Number of bathrooms is required').default(1),
  kitchens: yup.number().typeError('Kitchens must be a number').required('Number of kitchens is required').default(1),
  parking: yup.number().typeError('Parking must be a number').required('Number of parking spaces is required').default(1),

  // New Property Detail Fields
  yearBuilt: yup.number().optional().typeError('Year built must be a number'),
  floorArea: yup.number().optional().typeError('Floor area must be a number'),
  landArea: yup.number().optional().typeError('Land area must be a number'),
  furnished: yup.string().optional().oneOf(['furnished', 'semi-furnished', 'unfurnished']),
  floorNumber: yup.number().optional().typeError('Floor number must be a number'),
  totalFloors: yup.number().optional().typeError('Total floors must be a number'),
  propertyCondition: yup.string().optional().oneOf(['new', 'good', 'needs renovation', 'under renovation']),
  orientation: yup.string().optional(),

  // Location
  country: yup.string().required('Country is required').trim().default('nigeria'),
  state: yup.string().required('State is required').trim().default('lagos'),
  lga: yup.string().required('Local government area is required').trim(),
  city: yup.string().required('City is required').trim(),
  zip: yup.string().optional().default(""),
  address: yup.string().required('Address is required').trim(),

  location: yup
    .object({
      type: yup.string().oneOf(['Point']).default('Point'),
      coordinates: yup
        .array()
        .of(yup.number().typeError('Coordinate must be a number'))
        .length(2, 'Must have [longitude, latitude]'),
    })
    .nullable(),

  // Utilities & Amenities
  waterSupply: yup.string().nullable().oneOf(['public', 'borehole', 'none']),
  electricity: yup.string().nullable().oneOf(['public', 'generator', 'solar']),

  // Media
  videoLink: yup
    .string()
    .url("Must be a valid URL")
    .nullable()
    .transform((value) => (value === "" ? null : value)),
  
  videoFrom: yup
    .string()
    .default('youtube')
    .when("videoLink", {
      is: (val: string | null) => val !== null && val !== "",
      then: (schema) => schema.required("Please select a source for the video"),
      otherwise: (schema) => schema.nullable(),
    }),
  images: yup
    .array()
    .of(yup.mixed<File | string>().required('Image is required'))
    .required('Images are required')
    .min(5, 'At least 5 pictures of the property are required')
    .max(30, 'You can upload up to 30 pictures'),

  floorPlan: yup.array().of(yup.mixed<File | string>()).default([]),
  brochure: yup.string().url('Must be a valid URL').optional(),

  // Feature Categories
  general: yup.array().of(yup.string()).default([]),
  indoor: yup.array().of(yup.string()).default([]),
  outdoor: yup.array().of(yup.string()).default([]),
  climate: yup.array().of(yup.string()).default([]),
  tags: yup.string(),
  special: yup.array().of(yup.string()).default([]),
  recreation: yup.array().of(yup.string()).default([]),
  kitchen: yup.array().of(yup.string()).default([]),
  safety: yup.array().of(yup.string()).default([]),

  // Availability Dates
  availableFrom: yup.date().typeError('Available from must be a valid date').nullable(),
  availableTo: yup.date().typeError('Available to must be a valid date').nullable(),
  constructionStatus: yup.string().nullable().oneOf(['off-plan', 'under construction', 'ready to move']),
  handoverDate: yup.date().typeError('Handover date must be a valid date').nullable(),

  // Ownership & Legal
  ownerName: yup.string().nullable(),
  ownerContact: yup.string().nullable(),
  deedNumber: yup.string().nullable(),
  isVerified: yup.boolean().default(false),

  // Marketing & Tracking
  priority: yup.number().default(0).nullable(),
  views: yup.number().default(0).nullable(),
  inquiries: yup.number().default(0).nullable(),

  // Publication
  published: yup.boolean().default(true),
});

export type NewPropertySchemaType = yup.InferType<typeof newPropertySchema>;
export const newPropertyKeys = getAllowedKeysAndType<yup.InferType<typeof newPropertySchema>>(newPropertySchema)

