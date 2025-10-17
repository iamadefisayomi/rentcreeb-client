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


export async function updateProperty(
  propertyId: string,
  payload: Partial<NewPropertySchemaType>
) {
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

    const getKeys = await extractAllowedKeys<Partial<NewPropertySchemaType & {slug:  string}>>(payload, newPropertyKeys);
    if (!getKeys.success && getKeys.message) throw new Error(getKeys.message)
    const data = getKeys.data

    let updatedImages = property.images || [];
    if (Array.isArray(data.images) && data.images.length > 0) {
      const newFiles = data.images.filter((img: any): img is File => img instanceof File);
      const existingUrls = data.images.filter((img: any): img is string => typeof img === 'string');

      if (newFiles.length > 0) {
        const res = await uploadManyImages(newFiles);
        if (!res.success && res?.message) throw new Error(res.message || 'Image upload failed');
        const newUrls = res.data?.map((i: any) => i.url).filter(Boolean) ?? [];
        updatedImages = [...existingUrls, ...newUrls];
      } else {
        updatedImages = existingUrls;
      }
    }

    if (data.title && data.title !== property.title) {
      const newSlug = slugify(data.title);
      const exists = await Property.findOne({ userId: user.id, slug: newSlug });
      if (exists && exists._id.toString() !== propertyId) {
        throw new Error('You already have a property with this title');
      }
      data.slug = newSlug;
    }

    await property.updateOne({
      ...data,
      images: updatedImages,
      updatedAt: new Date(),
    });

    revalidatePath(Routes.dashboard["professional tools"]["my properties"]);

    return { success: true, message: 'Property updated successfully' };
  } catch (err: any) {
    return errorMessage(err.message);
  }
}





export async function createNewProperty(payload: NewPropertySchemaType) {
  try {
    await dbConnection()
    // 1. Authenticate user
    const { data: user, message, success } = await getCurrentUser();
    if (!success || !user) throw new Error(message || "Unauthorized");

    // 2. Extract valid data
    const getKeys = await extractAllowedKeys<NewPropertySchemaType>(payload, newPropertyKeys);
    if (!getKeys.success && getKeys.message) throw new Error(getKeys.message)
    const data = getKeys.data

    // 3. Generate slug from title
    const {title, listedIn, state, city, lga, type} = data
    const propertySlug = [title, type, listedIn, city, lga, state].filter(Boolean).join(" ")
    const slug = JSON.stringify(slugify(propertySlug));

    // 4. Check for duplicate listing by same user
    const existing = await Property.findOne({ userId: user.id, slug });
    if (existing) {
      return errorMessage("You have already listed a property with this title.");
    }

    // 5. Upload property images
    let uploadedImages: string[] = [];
    if (data.images && data.images.length > 0) {
      const result = await uploadManyImages(data.images as File[]);
      uploadedImages = result.data?.map((img: any) => img.url).filter(Boolean) ?? [];

      if (uploadedImages.length === 0) {
        throw new Error("Image upload failed. Please try again.");
      }
    }

    // 6. Normalize tags
    const tags =
      typeof data.tags === "string"
        ? data.tags.split(/[\s,]+/).map((tag: any) => tag.trim()).filter(Boolean)
        : data.tags ?? [];

    // 7. Create new property
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

  
  export async function getPropertyById(propertyId: string) {
    try {
      await dbConnection()
      const idFilter = Types.ObjectId.isValid(propertyId) ? { _id: new Types.ObjectId(propertyId) } : null;

      const prop = await Property.findOne({
        $or: [
          ...(idFilter ? [idFilter] : []),
          { slug: propertyId },
        ],
      });
  
      return { success: true, data: prop };
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


interface SimilarOptions {
  propertyId: string;
  maxDistanceMeters?: number;
  maxResults?: number;
  queryParams?: Partial<Record<string, string>>;
}

interface SimilarResult {
  title: string;
  price: number;
  bedrooms: number;
  city: string;
  location: { type: "Point"; coordinates: [number, number] };
  slug?: string;
  images: string[];
  distance: number;
}

export async function findSimilarProperties({
  propertyId,
  maxDistanceMeters = 5000,
  maxResults = 6,
  queryParams = {},
}: SimilarOptions) {
  try {
    const idFilter = Types.ObjectId.isValid(propertyId) ? { _id: new Types.ObjectId(propertyId) } : null;

    const prop = await Property.findOne({
      $or: [
        ...(idFilter ? [idFilter] : []),
        { slug: propertyId },
      ],
    });
    if (!prop?.location?.coordinates) return { success: true, data: [] };

    const [lng, lat] = prop.location.coordinates;

    const geoNearQuery: Record<string, any> = {
      _id: { $ne: new Types.ObjectId(prop._id) },
      published: true,
      isDeleted: false,
    };

    const postGeoMatch: Record<string, any> = {
      city: prop.city,
      type: prop.type,
      bedrooms: prop.bedrooms,
    };

    if (queryParams.bedrooms) postGeoMatch.bedrooms = Number(queryParams.bedrooms);
    if (queryParams.type) postGeoMatch.type = queryParams.type;
    if (queryParams.city) postGeoMatch.city = queryParams.city;
    if (queryParams.minPrice || queryParams.maxPrice) {
      postGeoMatch.price = {};
      if (queryParams.minPrice) postGeoMatch.price.$gte = Number(queryParams.minPrice);
      if (queryParams.maxPrice) postGeoMatch.price.$lte = Number(queryParams.maxPrice);
    }

    const pipeline: PipelineStage[] = [
      {
        $geoNear: {
          near: { type: "Point", coordinates: [lng, lat] },
          distanceField: "dist.calculated",
          maxDistance: maxDistanceMeters,
          spherical: true,
          query: geoNearQuery,
        },
      },
      { $match: postGeoMatch },
      { $limit: maxResults },
      {
        $project: {
          title: 1,
          price: 1,
          bedrooms: 1,
          city: 1,
          location: 1,
          slug: 1,
          images: 1,
          distance: "$dist.calculated",
        },
      },
    ];

    // Use native collection aggregation to avoid Mongoose pipeline optimization issues
    const results = (await Property.collection.aggregate(pipeline).toArray()) as SimilarResult[];

    return {
      success: true,
      data: results,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || "An error occurred",
      data: null,
    };
  }
}


// ---------------------------------------------

type SortInput =
  | string
  | { [key: string]: SortOrder | { $meta: any } }
  | [string, SortOrder][];

// ✅ Dynamic sort builder
function buildSort(
  sortBy?: string,
  order: SortOrder = -1,
  hasSearch?: boolean
): SortInput {
  if (hasSearch) return { score: { $meta: "textScore" } }; // text search priority
  if (!sortBy) return { createdAt: -1 }; // default: newest first
  return { [sortBy]: order };
}

// ✅ Main property fetcher
export async function getProperties({
  filters = {} as SearchPropertySchemaType,
  limit = 20,
  sortBy,
  order = -1,
  search,
}: {
  filters?: SearchPropertySchemaType;
  limit?: number;
  sortBy?: string;
  order?: SortOrder;
  search?: string;
}) {
  await dbConnection();

  const query: any = {};
  const hasSearch = !!search;

  // 🧠 Text search
  if (hasSearch) query.$text = { $search: search };

  // 🏷️ Core filters
  const filterFields = ["type", "listedIn", "state", "lga", "city"] as const;
  for (const key of filterFields) {
    if (filters[key]) query[key] = filters[key];
  }

  // 💰 Price range
  if (filters.min || filters.max) {
    query.price = {
      ...(filters.min && { $gte: filters.min }),
      ...(filters.max && { $lte: filters.max }),
    };
  }

  // 🧱 Amenities & security
  if (filters.amenities?.length) query.amenities = { $all: filters.amenities };
  if (filters.security?.length) query.security = { $all: filters.security };

  // 🛏️ Numeric features
  const numericFilters = ["bedrooms", "bathrooms", "garages", "parkings"] as const;
  for (const key of numericFilters) {
    if (filters[key]) query[key] = { $gte: filters[key] };
  }

  // 📍 Geo filter (5km radius)
  if (filters.location?.coordinates?.length === 2) {
    query.location = {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: filters.location.coordinates,
        },
        $maxDistance: 5000,
      },
    };
  }

  // 🧮 Determine sort logic
  const sortOption =
    _myPropertySort[sortBy as keyof typeof _myPropertySort]?.sort ||
    buildSort(sortBy, order, hasSearch);

  // 🚀 Main query (random fallback)
  let properties;
  if (Object.keys(query).length === 0 && !hasSearch) {
    properties = await Property.aggregate([{ $sample: { size: limit } }]);
  } else {
    properties = await Property.find(query)
      .sort(sortOption as any)
      .limit(limit)
      .lean();
  }

  if (!properties.length) {
    const fallback = await Property.aggregate([{ $sample: { size: limit } }]);
    return { properties: fallback, recommended: [], similarProperties: [] };
  }

  const base = properties[0];

  // 🔍 Recommended
  const recQuery = {
    _id: { $ne: base._id },
    $or: [
      { type: base.type },
      { state: base.state },
      { city: base.city },
      { amenities: { $in: base.amenities || [] } },
    ],
  };

  // 📍 Similar (geo + price + type)
  const simQuery =
    base.location?.coordinates?.length === 2
      ? {
          _id: { $ne: base._id },
          type: base.type,
          price: { $gte: base.price * 0.8, $lte: base.price * 1.2 },
          location: {
            $near: {
              $geometry: { type: "Point", coordinates: base.location.coordinates },
              $maxDistance: 8000,
            },
          },
        }
      : null;

  const [recommended, similarProperties] = await Promise.all([
    Property.find(recQuery).limit(10).lean().catch(() => []),
    simQuery ? Property.find(simQuery).limit(10).lean().catch(() => []) : [],
  ]);

  // 🧩 Fallback randoms
  const [finalRecommended, finalSimilar] = await Promise.all([
    recommended.length
      ? recommended
      : Property.aggregate([
          { $match: { _id: { $ne: base._id } } },
          { $sample: { size: 10 } },
        ]),
    similarProperties.length
      ? similarProperties
      : Property.aggregate([
          { $match: { _id: { $ne: base._id } } },
          { $sample: { size: 10 } },
        ]),
  ]);

  return { properties, recommended: finalRecommended, similarProperties: finalSimilar };
}


// export async function getProperties({ query = {}, forcedLimit }: GetPropertyProps) {
//   try {
//     await dbConnection();

//     const filters: Record<string, any> = {};
//     const {
//       type,
//       listedIn,
//       state,
//       city,
//       lga,
//       search,
//       min,
//       max,
//       bedrooms,
//       bathrooms,
//       garages,
//       parkings,
//       amenities,
//       security,
//       page: qPage,
//       limit: qLimit,
//       sort: qSort,
//       order: qOrder,
//     } = query;

//     // Core filters
//     if (parseString(type) && type !== "all" ) filters.type = parseString(type);
//     if (parseString(listedIn) && listedIn !== "all") filters.listedIn = parseString(listedIn);
//     if (parseString(state)) filters.state = { $regex: parseString(state), $options: "i" };
//     if (parseString(city)) filters.city = { $regex: parseString(city), $options: "i" };
//     if (parseString(lga)) filters.lga = { $regex: parseString(lga), $options: "i" };

//     // Ranges
//     const minPrice = parseNumber(min);
//     const maxPrice = parseNumber(max);
//     if (minPrice !== undefined || maxPrice !== undefined) {
//       filters.price = {};
//       if (minPrice !== undefined) filters.price.$gte = minPrice;
//       if (maxPrice !== undefined) filters.price.$lte = maxPrice;
//     }
//     if (parseNumber(bedrooms) !== undefined) filters.bedrooms = { $gte: parseNumber(bedrooms) };
//     if (parseNumber(bathrooms) !== undefined) filters.bathrooms = { $gte: parseNumber(bathrooms) };
//     if (parseNumber(garages) !== undefined || parseNumber(parkings) !== undefined) {
//       filters.parking = { $gte: parseNumber(garages) ?? parseNumber(parkings) };
//     }

//     // Arrays
//     const amenityArr = parseArray(amenities);
//     if (amenityArr?.length) {
//       filters.$or = [
//         { general: { $in: amenityArr } },
//         { indoor: { $in: amenityArr } },
//         { outdoor: { $in: amenityArr } },
//         { climate: { $in: amenityArr } },
//       ];
//     }
//     const securityArr = parseArray(security);
//     if (securityArr?.length) filters.special = { $in: securityArr };

//     // Full-text search (requires text index on title/description)
//     const searchTerm = parseString(search);
//     if (searchTerm) {
//       filters.$text = { $search: searchTerm };
//     }

//     // Pagination + sorting
//     const page = parseNumber(qPage) || 1;
//     const limit = forcedLimit || parseNumber(qLimit) || 12;
//     const skip = (page - 1) * limit;

//     const sort = buildSort(
//       parseString(qSort) || "createdAt",
//       (parseString(qOrder) as SortOrder) || -1,
//       !!searchTerm
//     );

//     // Query
//     const [properties, total] = await Promise.all([
//       Property.find(filters, searchTerm ? { score: { $meta: "textScore" } } : {})
//         .sort(sort)
//         .skip(skip)
//         .limit(limit),
//       Property.countDocuments(filters),
//     ]);

//     return {
//       success: true,
//       data: properties,
//       pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
//     };
//   } catch (err: any) {
//     return errorMessage(err.message);
//   }
// }

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
