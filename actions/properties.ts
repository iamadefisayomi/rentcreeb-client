"use server";


import { errorMessage } from "@/constants";
import { newPropertyKeys, NewPropertySchemaType } from "@/sections/dashboard/formSchemas";
import { extractAllowedKeys } from "@/utils/extractAllowedKeys";
import { getCurrentUser } from "./auth";
import { uploadManyImages } from "./imagekit";
import { revalidatePath } from "next/cache";
import Routes from "@/Routes";
import _ from "lodash";
import Property from "@/server/schema/Property";
import { slugify } from "@/utils/slugify"
import { Types } from 'mongoose';
import type { PipelineStage, SortOrder } from 'mongoose';
import { dbConnection } from "@/lib/dbConnection";
import { _properties } from "@/_data/images";
import { SearchPropertySchemaType } from "@/sections/SearchForms/formSchemas";
import { _myPropertySort } from "@/_data/_propertyDefault";

import type { PropertyDocument } from "@/server/schema/Property";

type LeanProperty = Omit<PropertyDocument, "userId"> & {
  userId: string; // or object if you populate it
};


// -------------------------
// UPDATE PROPERTY
// -------------------------
export async function updateProperty(propertyId: string, payload: Partial<NewPropertySchemaType>) {
  try {
    await dbConnection();
    if (!propertyId || typeof propertyId !== "string") throw new Error("Invalid property ID");

    const { data: user, success, message } = await getCurrentUser();
    if (!success || !user) throw new Error(message || "Authentication required");

    const property = await Property.findById(propertyId).lean<LeanProperty>();
    if (!property) throw new Error("Property not found");

    if (property.userId.toString() !== user.id) throw new Error("You are not authorized to update this property");

    const getKeys = await extractAllowedKeys<Partial<NewPropertySchemaType & { slug: string }>>(payload, newPropertyKeys);
    if (!getKeys.success && getKeys.message) throw new Error(getKeys.message);
    const data = getKeys.data;

    // ------------------- IMAGES -------------------
    let updatedImages = property.images || [];
    if (Array.isArray(data.images) && data.images.length > 0) {
      const newFiles = data.images.filter((img: any): img is File => img instanceof File);
      const existingUrls = data.images.filter((img: any): img is string => typeof img === "string");

      const newUrls = newFiles.length
        ? (await uploadManyImages(newFiles)).data?.map((i: any) => i.url).filter(Boolean) ?? []
        : [];

      updatedImages = [...existingUrls, ...newUrls];
    }

    // ------------------- SLUG -------------------
    if (data.title && data.title !== property.title) {
      const newSlug = slugify(data.title);
      const exists = await Property.findOne({ userId: user.id, slug: newSlug }).lean<LeanProperty>();
      if (exists && exists._id.toString() !== propertyId) throw new Error("You already have a property with this title");
      data.slug = newSlug;
    }

    // ------------------- UPDATE -------------------
    await Property.updateOne(
      { _id: propertyId },
      {
        $set: {
          ...data,
          images: updatedImages,
          updatedAt: new Date(),
        },
      }
    );

    revalidatePath(Routes.dashboard["professional tools"]["my properties"]);

    return { success: true, message: "Property updated successfully" };
  } catch (err: any) {
    return errorMessage(err.message);
  }
}


// export async function updateProperty(
//   propertyId: string,
//   payload: Partial<NewPropertySchemaType>
// ) {
//   try {
//     await dbConnection()
//     if (!propertyId || typeof propertyId !== 'string') {
//       throw new Error('Invalid property ID');
//     }

//     const { data: user, success, message } = await getCurrentUser();
//     if (!success || !user) {
//       throw new Error(message || 'Authentication required');
//     }

//     const property = await Property.findById(propertyId);
//     if (!property) {
//       throw new Error('Property not found');
//     }
//     if (property.userId !== user.id) {
//       throw new Error('You are not authorized to update this property');
//     }

//     const getKeys = await extractAllowedKeys<Partial<NewPropertySchemaType & {slug:  string}>>(payload, newPropertyKeys);
//     if (!getKeys.success && getKeys.message) throw new Error(getKeys.message)
//     const data = getKeys.data

//     let updatedImages = property.images || [];
//     if (Array.isArray(data.images) && data.images.length > 0) {
//       const newFiles = data.images.filter((img: any): img is File => img instanceof File);
//       const existingUrls = data.images.filter((img: any): img is string => typeof img === 'string');

//       if (newFiles.length > 0) {
//         const res = await uploadManyImages(newFiles);
//         if (!res.success && res?.message) throw new Error(res.message || 'Image upload failed');
//         const newUrls = res.data?.map((i: any) => i.url).filter(Boolean) ?? [];
//         updatedImages = [...existingUrls, ...newUrls];
//       } else {
//         updatedImages = existingUrls;
//       }
//     }

//     if (data.title && data.title !== property.title) {
//       const newSlug = slugify(data.title);
//       const exists = await Property.findOne({ userId: user.id, slug: newSlug });
//       if (exists && exists._id.toString() !== propertyId) {
//         throw new Error('You already have a property with this title');
//       }
//       data.slug = newSlug;
//     }

//     await property.updateOne({
//       ...data,
//       images: updatedImages,
//       updatedAt: new Date(),
//     });

//     revalidatePath(Routes.dashboard["professional tools"]["my properties"]);

//     return { success: true, message: 'Property updated successfully' };
//   } catch (err: any) {
//     return errorMessage(err.message);
//   }
// }

// -------------------------
// CREATE NEW PROPERTY
// -------------------------
export async function createNewProperty(payload: NewPropertySchemaType) {
  try {
    await dbConnection();

    const { data: user, message, success } = await getCurrentUser();
    if (!success || !user) throw new Error(message || "Unauthorized");

    const getKeys = await extractAllowedKeys<NewPropertySchemaType>(payload, newPropertyKeys);
    if (!getKeys.success && getKeys.message) throw new Error(getKeys.message);
    const data = getKeys.data;

    const { title, listedIn, state, city, lga, type } = data;
    const slug = slugify([title, type, listedIn, city, lga, state].filter(Boolean).join(" "));

    const existing = await Property.findOne({ userId: user.id, slug }).lean();
    if (existing) return errorMessage("You have already listed a property with this title.");

    // ------------------- UPLOAD IMAGES -------------------
    let uploadedImages: string[] = [];
    if (data.images?.length) {
      const res = await uploadManyImages(data.images as File[]);
      uploadedImages = res.data?.map((img: any) => img.url).filter(Boolean) ?? [];
      if (!uploadedImages.length) throw new Error("Image upload failed. Please try again.");
    }

    // ------------------- NORMALIZE TAGS -------------------
    const tags = Array.isArray(data.tags)
      ? data.tags.map((tag: string) => tag.trim()).filter(Boolean)
      : typeof data.tags === "string"
      ? data.tags.split(/[\s,]+/).map((t: string) => t.trim()).filter(Boolean)
      : [];

    // ------------------- CREATE -------------------
    const newProperty = await Property.create({
      ...data,
      slug,
      userId: user.id,
      tags,
      images: uploadedImages,
    });

    return {
      success: true,
      message: "Property created successfully.",
      data: { id: newProperty._id, slug: newProperty.slug },
    };
  } catch (err: any) {
    return errorMessage(err.message || "Failed to create property.");
  } finally {
    revalidatePath("/");
  }
}



// export async function createNewProperty(payload: NewPropertySchemaType) {
//   try {
//     await dbConnection()
//     // 1. Authenticate user
//     const { data: user, message, success } = await getCurrentUser();
//     if (!success || !user) throw new Error(message || "Unauthorized");

//     // 2. Extract valid data
//     const getKeys = await extractAllowedKeys<NewPropertySchemaType>(payload, newPropertyKeys);
//     if (!getKeys.success && getKeys.message) throw new Error(getKeys.message)
//     const data = getKeys.data

//     // 3. Generate slug from title
//     const {title, listedIn, state, city, lga, type} = data
//     const propertySlug = [title, type, listedIn, city, lga, state].filter(Boolean).join(" ")
//     const slug = JSON.stringify(slugify(propertySlug));

//     // 4. Check for duplicate listing by same user
//     const existing = await Property.findOne({ userId: user.id, slug });
//     if (existing) {
//       return errorMessage("You have already listed a property with this title.");
//     }

//     // 5. Upload property images
//     let uploadedImages: string[] = [];
//     if (data.images && data.images.length > 0) {
//       const result = await uploadManyImages(data.images as File[]);
//       uploadedImages = result.data?.map((img: any) => img.url).filter(Boolean) ?? [];

//       if (uploadedImages.length === 0) {
//         throw new Error("Image upload failed. Please try again.");
//       }
//     }

//     // 6. Normalize tags
//     const tags =
//       typeof data.tags === "string"
//         ? data.tags.split(/[\s,]+/).map((tag: any) => tag.trim()).filter(Boolean)
//         : data.tags ?? [];

//     // 7. Create new property
//     const newProperty = await Property.create({
//       ...data,
//       slug,
//       userId: user.id,
//       tags,
//       images: uploadedImages,
//     });

//     return {
//       success: true,
//       message: "Property created successfully.",
//       data: { id: newProperty._id, slug: newProperty.slug },
//     };

//   } catch (err: any) {
//     return errorMessage(err.message || "Failed to create property.");
//   } finally {
//     revalidatePath("/");
//   }
// }

  
export async function getPropertyById(propertyId: string) {
  try {
    await dbConnection();

    const isValidId = Types.ObjectId.isValid(propertyId);

    const filter = isValidId
      ? {
          $or: [
            { _id: new Types.ObjectId(propertyId) },
            { slug: propertyId },
          ],
        }
      : { slug: propertyId };

    const prop = await Property.findOne(filter)
      .populate({
        path: "userId",
        model: "User",
        select: "name email username image",
      });

    if (!prop) {
      return {
        success: false,
        data: null,
        message: "Property not found",
      };
    }

    return {
      success: true,
      data: prop?.toObject(),
    };
  } catch (err: any) {
    return errorMessage(err.message);
  }
}


  

export async function getPropertyByUserId(userId: string) {
    try {
      await dbConnection()
      const properties = await Property.find({userId}).lean()
  
      return { success: true, data: properties };
    } catch (err: any) {
      return errorMessage(err.message);
    }
  }

  export async function getCurrentUserProperties() {
    try {
      const { data: user, message, success } = await getCurrentUser();
      if (!success && message) throw new Error(message);
  
      const properties = await Property.find({userId: user.id}).lean()
  
      return ({ 
        success: true, 
        data: properties 
      })
    } catch (err: any) {
      return errorMessage(err.message);
    }
  }
  
  
export async function deleteProperty(propertyId: string) {
    try {
      await dbConnection()
      if (!propertyId || typeof propertyId !== 'string') {
        throw new Error('Invalid property ID');
      }

    const { data: user, success, message } = await getCurrentUser();
    if (!success || !user) {
      throw new Error(message || 'Authentication required');
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      throw new Error('Property not found');
    }
    if (property.userId !== user.id) {
      throw new Error('You are not authorized to update this property');
    }
    //
    await property.updateOne({
      updatedAt: new Date(),
      isDeleted: true,
      published: false
    });
    // 
      return { success: true, message: "Property deleted successfully" };
    } catch (err: any) {
      return errorMessage(err.message);
    }
    finally{
      revalidatePath(Routes.dashboard["professional tools"]["my properties"])
    }
  }


// interface SimilarOptions {
//   propertyId: string;
//   maxDistanceMeters?: number;
//   maxResults?: number;
//   queryParams?: Partial<Record<string, string>>;
// }

// interface SimilarResult {
//   title: string;
//   price: number;
//   bedrooms: number;
//   city: string;
//   location: { type: "Point"; coordinates: [number, number] };
//   slug?: string;
//   images: string[];
//   distance: number;
// }

// export async function findSimilarProperties({
//   propertyId,
//   maxDistanceMeters = 5000,
//   maxResults = 6,
//   queryParams = {},
// }: SimilarOptions) {
//   try {
//     const idFilter = Types.ObjectId.isValid(propertyId) ? { _id: new Types.ObjectId(propertyId) } : null;

//     const prop = await Property.findOne({
//       $or: [
//         ...(idFilter ? [idFilter] : []),
//         { slug: propertyId },
//       ],
//     });
//     if (!prop?.location?.coordinates) return { success: true, data: [] };

//     const [lng, lat] = prop.location.coordinates;

//     const geoNearQuery: Record<string, any> = {
//       _id: { $ne: new Types.ObjectId(prop._id) },
//       published: true,
//       isDeleted: false,
//     };

//     const postGeoMatch: Record<string, any> = {
//       city: prop.city,
//       type: prop.type,
//       bedrooms: prop.bedrooms,
//     };

//     if (queryParams.bedrooms) postGeoMatch.bedrooms = Number(queryParams.bedrooms);
//     if (queryParams.type) postGeoMatch.type = queryParams.type;
//     if (queryParams.city) postGeoMatch.city = queryParams.city;
//     if (queryParams.minPrice || queryParams.maxPrice) {
//       postGeoMatch.price = {};
//       if (queryParams.minPrice) postGeoMatch.price.$gte = Number(queryParams.minPrice);
//       if (queryParams.maxPrice) postGeoMatch.price.$lte = Number(queryParams.maxPrice);
//     }

//     const pipeline: PipelineStage[] = [
//       {
//         $geoNear: {
//           near: { type: "Point", coordinates: [lng, lat] },
//           distanceField: "dist.calculated",
//           maxDistance: maxDistanceMeters,
//           spherical: true,
//           query: geoNearQuery,
//         },
//       },
//       { $match: postGeoMatch },
//       { $limit: maxResults },
//       {
//         $project: {
//           title: 1,
//           price: 1,
//           bedrooms: 1,
//           city: 1,
//           location: 1,
//           slug: 1,
//           images: 1,
//           distance: "$dist.calculated",
//         },
//       },
//     ];

//     // Use native collection aggregation to avoid Mongoose pipeline optimization issues
//     const results = (await Property.collection.aggregate(pipeline).toArray()) as SimilarResult[];

//     return {
//       success: true,
//       data: results,
//     };
//   } catch (err: any) {
//     return {
//       success: false,
//       message: err.message || "An error occurred",
//       data: null,
//     };
//   }
// }

/* ---------------- UTILS ---------------- */

function toClientSafe(data: any) {
  return JSON.parse(JSON.stringify(data));
}

export async function getProperties({
  filters = {},
  limit = 20,
  page = 1,
  sortBy,
  search,
}: {
  filters?: Partial<SearchPropertySchemaType>;
  limit?: number;
  page?: number;
  sortBy?: keyof typeof _myPropertySort;
  search?: string;
}) {
  await dbConnection();

  const skip = (page - 1) * limit;
  const hasSearch = !!search?.trim();

  /** ---------------- BUILD QUERY ---------------- */
  const match: Record<string, any> = {};

  // Text search
  if (hasSearch) {
    match.$text = { $search: search!.trim() };
  }

  // Exact string filters (case-insensitive)
  const stringFields: (keyof SearchPropertySchemaType)[] = ["type", "listedIn", "state", "city", "lga"];
  for (const key of stringFields) {
    const val = filters[key];
    if (val && val !== "all") {
      match[key] = { $regex: `^${val.trim()}$`, $options: "i" }; // exact match, ignore case
    }
  }

  // Price filters
  if (filters.min || filters.max) {
    match.price = {
      ...(filters.min && { $gte: Number(filters.min) }),
      ...(filters.max && { $lte: Number(filters.max) }),
    };
  }

  // Numeric filters
  const numericFields: (keyof SearchPropertySchemaType)[] = ["bedrooms", "bathrooms", "garages", "parkings"];
  for (const field of numericFields) {
    const val = filters[field];
    if (val && Number(val) > 0) {
      match[field] = { $gte: Number(val) };
    }
  }

  // Geo filter
  if (filters.location?.coordinates?.length === 2) {
    match.location = {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: filters.location.coordinates,
        },
        $maxDistance: 5000,
      },
    };
  }

  /** ---------------- BUILD SORT ---------------- */
  let sortStage: Record<string, any> = {};
  if (hasSearch) {
    sortStage = { score: { $meta: "textScore" } };
  } else if (sortBy && _myPropertySort[sortBy]) {
    sortStage = _myPropertySort[sortBy].sort;
  } else {
    // Default: priority by state/city match + newest
    sortStage = { priorityScore: -1, createdAt: -1 };
  }

  /** ---------------- AGGREGATION PIPELINE ---------------- */
  const pipeline: any[] = [
    { $match: match },

    // PriorityScore for default sorting
    ...(sortBy ? [] : [
      {
        $addFields: {
          priorityScore: {
            $add: [
              { $cond: [{ $eq: ["$state", filters.state] }, 3, 0] },
              { $cond: [{ $eq: ["$city", filters.city] }, 2, 0] },
            ],
          },
        },
      },
    ]),

    { $sort: sortStage },
    { $skip: skip },
    { $limit: limit },
  ];

  let propertiesRaw = await Property.aggregate(pipeline);
  propertiesRaw = await Property.populate(propertiesRaw, {
    path: "userId",
    select: "name email username image",
  });

  const properties = toClientSafe(propertiesRaw);

  /** ---------------- PAGE > 1: Skip extras ---------------- */
  if (page !== 1) {
    return { properties, recommended: [], similarProperties: [] };
  }

  if (!properties.length) {
    return { properties: [], recommended: [], similarProperties: [] };
  }

  const base = properties[0];

  /** ---------------- RECOMMENDED ---------------- */
  const recommendedRaw = await Property.find({
    _id: { $ne: base._id },
    $or: [
      { state: base.state },
      { city: base.city },
      { type: base.type },
    ],
  })
    .limit(10)
    .populate({ path: "userId", select: "name email username image" })
    .lean();

  const recommended = toClientSafe(recommendedRaw);

  /** ---------------- SIMILAR ---------------- */
  let similarProperties: PropertyDocument[] = [];
  if (base.location?.coordinates?.length === 2) {
    const simRaw = await Property.find({
      _id: { $ne: base._id },
      type: base.type,
      price: { $gte: base.price * 0.8, $lte: base.price * 1.2 },
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: base.location.coordinates },
          $maxDistance: 8000,
        },
      },
    })
      .limit(10)
      .populate({ path: "userId", select: "name email username image" })
      .lean();

    similarProperties = toClientSafe(simRaw);
  }

  return { properties, recommended, similarProperties };
}










// ------------------------------------------------
// Get random property images
export async function getRandomPropertyImages(limit = 5) {
  try {
    await dbConnection();

    const matchQuery = {
      isAvailable: true,
      isDeleted: false,
      images: { $exists: true, $ne: [] }
    };

    const properties = await Property.aggregate([
      { $match: matchQuery },
      { $sample: { size: limit } },
      { $project: { images: 1 } }
    ]);

    let selectedImages: string[] = [];

    for (const property of properties) {
      if (selectedImages.length >= limit) break;
      const imgs = property.images;
      if (imgs?.length) {
        const randomImg = imgs[Math.floor(Math.random() * imgs.length)];
        selectedImages.push(randomImg);
      }
    }

    if (selectedImages.length < limit) {
      const needed = limit - selectedImages.length;
      const fallback = _properties.slice(0, needed).map(p => p.image);
      selectedImages = [...selectedImages, ...fallback];
    }

    return ({
      success: true,
      data: selectedImages
    });

  } catch (err: any) {
    return errorMessage(err.message)
  }
}
