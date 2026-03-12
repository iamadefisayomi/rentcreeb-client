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
import { dbConnection } from "@/lib/dbConnection";
import { _properties } from "@/_data/images";
import { SearchPropertySchemaType } from "@/sections/SearchForms/formSchemas";
import { _myPropertySort } from "@/_data/_propertyDefault";

import type { PropertyDocument } from "@/server/schema/Property";
import mongoose from "mongoose";



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
    const slug = slugify([listedIn, title, type, city, lga, state].filter(Boolean).join(" ")).toLowerCase();

    const existing = await Property.findOne({ userId: user.id, slug }).lean();
    if (existing) return errorMessage("You have already listed a property with this title.");

    // ------------------- UPLOAD IMAGES -------------------
    let uploadedImages: string[] = [];
    if (data.images?.length) {
      const res = await uploadManyImages(data.images as string[]);
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
    const { images, ...rest } = data;

    const newProperty = await Property.create({
      ...rest,
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
    await dbConnection();

    let property;

    const isValidId = mongoose.Types.ObjectId.isValid(propertyId)
    if (isValidId) {
      property = await Property.findById(propertyId)
      .populate({
        path: "userId",
        select: "name email username image",
        options: { lean: true }
      })
      .lean();
    }
    if (!property) {
      property = await Property.findOne({slug: { $regex: `^${propertyId}$`, $options: "i" }})
      .populate({
        path: "userId",
        select: "name email username image",
        options: { lean: true }
      })
      .lean();
    }

    if (!property) {
      return {
        success: false,
        data: null,
        message: "Property not found",
      };
    }

    return {
      success: true,
      data: property,
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


/* ---------------- UTILS ---------------- */
function toClientSafe(data: any) {
  return JSON.parse(JSON.stringify(data));
}

export async function getProperties({
  filters = {},
  limit = 20,
  page = 1,
}: {
  filters?: Partial<SearchPropertySchemaType & { sortBy: string }>;
  limit?: number;
  page?: number;
}) {
  await dbConnection();

  const sortBy = filters.sortBy as keyof typeof _myPropertySort;
  const skip = (page - 1) * limit;

  /** ---------------- BUILD QUERY ---------------- */
  const match: Record<string, any> = {};

  const stringFields: (keyof SearchPropertySchemaType)[] = [
    "type",
    "listedIn",
    "state",
    "city",
    "lga",
  ];
  function escapeRegex(value: string) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  for (const key of stringFields) {
    const val = filters[key];

    if (val && val !== "all") {
      match[key] = {
        $regex: `^${escapeRegex(String(val))}$`,
        $options: "i", // case insensitive
      };
    }
  }

  if (filters.min || filters.max) {
    match.price = {
      ...(filters.min && { $gte: Number(filters.min) }),
      ...(filters.max && { $lte: Number(filters.max) }),
    };
  }

  const numericFields: (keyof SearchPropertySchemaType)[] = [
    "bedrooms",
    "bathrooms",
    "garages",
    "parkings",
  ];
  for (const field of numericFields) {
    const val = filters[field];
    if (val && Number(val) > 0) {
      match[field] = { $gte: Number(val) };
    }
  }

  if (filters.location?.coordinates?.length === 2) {
    match.location = {
      $near: {
        $geometry: { type: "Point", coordinates: filters.location.coordinates },
        $maxDistance: 5000,
      },
    };
  }
  
  /** ---------------- SORT ---------------- */
  let sortStage: Record<string, any> = {};
  if (sortBy && _myPropertySort[sortBy]) {
    sortStage = _myPropertySort[sortBy].sort;
  } else {
    sortStage = { createdAt: -1 }; // simple default
  }

  /** ---------------- FETCH MAIN PROPERTIES ---------------- */
  let propertiesRaw = await Property.find(match)
    .sort(sortStage)
    .skip(skip)
    .limit(limit)
    .populate({ path: "userId", select: "name email username image" })
    .lean();

  const properties = toClientSafe(propertiesRaw);

  /** ---------------- PAGE > 1: Skip expensive extras ---------------- */
  if (page !== 1) {
    return { properties, recommended: [], similarProperties: [] };
  }

  /** ---------------- RECOMMENDED ---------------- */
  let recommended: any[] = [];
  if (properties.length) {
    const base = properties[0];
    recommended = await Property.find({
      _id: { $ne: base._id },
      $or: [{ state: base.state }, { city: base.city }, { type: base.type }],
    })
      .limit(10)
      .populate({ path: "userId", select: "name email username image" })
      .lean();
    recommended = toClientSafe(recommended);
  }

  /** ---------------- SIMILAR ---------------- */
  let similarProperties: any[] = [];
  if (properties.length && properties[0].location?.coordinates?.length === 2) {
    const base = properties[0];
    similarProperties = await Property.find({
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
    similarProperties = toClientSafe(similarProperties);
  }

  return { properties, recommended, similarProperties };
}


export async function getSimilarProperties(propertyId: string, limit = 10) {
  await dbConnection();

  /** ---------------- GET BASE PROPERTY ---------------- */
  const base = await Property.findById(propertyId)
    .select("type price location state city lga")
    .lean() as any;

  if (!base) {
    return [];
  }

  /** ---------------- BUILD QUERY ---------------- */
  const match: Record<string, any> = {
    _id: { $ne: base._id },
    type: base.type,
  };

  /** ---------------- PRICE RANGE ---------------- */
  if (base.price) {
    match.price = {
      $gte: base.price * 0.8,
      $lte: base.price * 1.2,
    };
  }

  /** ---------------- LOCATION ---------------- */
  if (base.location?.coordinates?.length === 2) {
    match.location = {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: base.location.coordinates,
        },
        $maxDistance: 8000,
      },
    };
  } else {
    match.$or = [
      { state: base.state },
      { city: base.city },
      { lga: base.lga },
    ];
  }

  /** ---------------- FETCH SIMILAR ---------------- */
  const similarRaw = await Property.find(match)
    .limit(limit)
    .populate({
      path: "userId",
      select: "name email username image",
    })
    .lean();

  return toClientSafe(similarRaw);
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



