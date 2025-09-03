"use server";

import { Readable } from "stream";
import { pipeline } from "stream/promises";
import pLimit from "p-limit";
import { convertToWebp } from "@/lib/image-utils";
import { getGridFSBucket } from "@/lib/gridfs";
import { errorMessage, NEXT_PUBLIC_BASE_URL } from "@/constants";
import { ObjectId } from "mongodb";


const MAX_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

function validateFile(file: File): void {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(`Unsupported file type: ${file.type}`);
  }
  if (file.size > MAX_SIZE) {
    throw new Error(`File too large (max 2MB): ${file.name}`);
  }
}

function getSafeFilename(name: string): string {
  return `${name.split(".")[0]}-${Date.now()}.webp`;
}

export async function uploadSingleImage(file: File): Promise<{
  success: boolean;
  message: string;
  data?: { id: string; url: string };
}> {
  try {
    validateFile(file);

    const buffer = Buffer.from(await file.arrayBuffer());
    const webpBuffer = await convertToWebp(buffer);

    const bucket = await getGridFSBucket();
    const filename = getSafeFilename(file.name);

    const uploadStream = bucket.openUploadStream(filename, {
      contentType: "image/webp",
    });

    await pipeline(Readable.from(webpBuffer), uploadStream);

    const imageId = uploadStream.id.toString();

    return {
      success: true,
      message: "Image uploaded successfully",
      data: {
        id: imageId,
        url: `${NEXT_PUBLIC_BASE_URL}/api/image/${imageId}`,
      },
    };
  } catch (err: any) {
    return errorMessage(err.message || "Upload failed");
  }
}


export async function uploadMultipleImages(files: File[]): Promise<{
  success: boolean;
  message: string;
  data?: { id: string; url: string }[];
}> {
  try {
    if (!Array.isArray(files) || files.length === 0) {
      throw new Error("No files provided");
    }

    const bucket = await getGridFSBucket();
    const limit = pLimit(5); // limit concurrency

    const uploads = await Promise.all(
      files.map((file) =>
        limit(async () => {
          validateFile(file);

          const buffer = Buffer.from(await file.arrayBuffer());
          const webpBuffer = await convertToWebp(buffer);

          const filename = getSafeFilename(file.name);
          const uploadStream = bucket.openUploadStream(filename, {
            contentType: "image/webp",
          });

          await pipeline(Readable.from(webpBuffer), uploadStream);

          const id = uploadStream.id.toString();
          return {
            id,
            url: `${NEXT_PUBLIC_BASE_URL}/api/image/${id}`,
          };
        })
      )
    );

    return {
      success: true,
      message: "Images uploaded successfully",
      data: uploads,
    };
  } catch (err: any) {
    return errorMessage(err.message || "Upload failed");
  }
}


export async function deleteImage(imageId: string): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    if (!imageId || !ObjectId.isValid(imageId)) {
      throw new Error("Invalid image ID");
    }

    const bucket = await getGridFSBucket();
    await bucket.delete(new ObjectId(imageId));

    return {
      success: true,
      message: "Image deleted successfully",
    };
  } catch (err: any) {
    return errorMessage(err.message || "Failed to delete image");
  }
}
