import * as yup from "yup";

export const propertySearchSchema = yup.object({
  type: yup.string().nullable(),
  listedIn: yup.string().nullable(),
  state: yup.string().trim().nullable(),
  lga: yup.string().trim().nullable(),
  city: yup.string().trim().nullable(),
  min: yup.number().nullable(),
  max: yup.number().nullable(),
  amenities: yup.array().of(yup.string()).nullable(),
  security: yup.array().of(yup.string()).nullable(),
  verified: yup.string().nullable(),
  bedrooms: yup.number().nullable(),
  bathrooms: yup.number().nullable(),
  garages: yup.number().nullable(),
  parkings: yup.number().nullable(),
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
  furnished: yup
    .string()
    .oneOf(["furnished", "semi-furnished", "unfurnished"])
    .nullable(),
  propertyCondition: yup
    .string()
    .oneOf(["new", "good", "needs renovation", "under renovation"])
    .nullable(),
  waterSupply: yup
    .string()
    .oneOf(["public", "borehole", "none"])
    .nullable(),
  electricity: yup
    .string()
    .oneOf(["public", "generator", "solar"])
    .nullable(),
  constructionStatus: yup
    .string()
    .oneOf(["off-plan", "under construction", "ready to move"])
    .nullable(),
});

export type SearchPropertySchemaType = yup.InferType<typeof propertySearchSchema>;
