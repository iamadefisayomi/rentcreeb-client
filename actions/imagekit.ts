"use server";

import ShortUniqueId from "short-unique-id";
import { errorMessage } from "@/constants";
import { convertToWebp, getImageKit } from "@/lib/image-utils";

const uid = new ShortUniqueId({ length: 6 });

const MAX_SIZE = 3 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

function parseBase64(base64: string) {
  const matches = base64.match(/^data:(.+);base64,(.+)$/);

  if (!matches) {
    throw new Error("Invalid base64 image format");
  }

  const mime = matches[1];
  const data = matches[2];

  if (!ALLOWED_TYPES.includes(mime)) {
    throw new Error(`Unsupported image type: ${mime}`);
  }

  const buffer = Buffer.from(data, "base64");

  if (buffer.length > MAX_SIZE) {
    throw new Error("Image exceeds 3MB limit");
  }

  return buffer;
}

function getSafeFilename() {
  return `${uid.randomUUID()}.webp`;
}






/*
 Upload single base64 image
*/
export async function uploadSingleImage(base64: string) {
  try {
    const buffer = parseBase64(base64);

    const webpBuffer = await convertToWebp(buffer);

    const filename = getSafeFilename();

    const imagekit = getImageKit();

    const res = await imagekit.upload({
      file: webpBuffer,
      fileName: filename,
      useUniqueFileName: false,
    });

    return {
      success: true,
      message: "Image uploaded successfully",
      data: {
        id: res.fileId,
        url: res.url,
        thumbnail: res.thumbnailUrl,
      },
    };
  } catch (err: any) {
    return errorMessage(err.message || "Image upload failed");
  }
}







/*
 Upload multiple base64 images
 Uses concurrency workers for speed
*/
export async function uploadManyImages(images: string[]) {
  try {
    if (!Array.isArray(images) || images.length === 0) {
      throw new Error("No images provided");
    }

    const concurrencyLimit = 5;

    const results: {
      id?: string;
      url?: string;
      thumbnail?: string;
      error?: string;
    }[] = new Array(images.length);

    let currentIndex = 0;

    async function worker() {
      while (true) {
        const index = currentIndex++;

        if (index >= images.length) break;

        const base64 = images[index];

        try {
          const result = await uploadSingleImage(base64);

          if (result.success) {
            results[index] = result.data;
          } else {
            results[index] = { error: result.message };
          }
        } catch (err: any) {
          results[index] = {
            error: err.message || "Upload failed",
          };
        }
      }
    }

    const workers = Array.from(
      { length: Math.min(concurrencyLimit, images.length) },
      () => worker()
    );

    await Promise.all(workers);

    return {
      success: true,
      message: "Images uploaded successfully",
      data: results,
    };
  } catch (err: any) {
    return errorMessage(err.message || "Failed to upload images");
  }
}








/*
 Delete single image
*/
export async function deleteSingleImage(fileId: string) {
  try {
    if (!fileId) throw new Error("File ID is required");

    const imagekit = getImageKit();

    const res = await imagekit.deleteFile(fileId);

    return {
      success: true,
      message: "Image deleted successfully",
      data: res,
    };
  } catch (err: any) {
    return errorMessage(err.message || "Failed to delete image");
  }
}








/*
 Delete multiple images
*/
export async function deleteManyImages(fileIds: string[]) {
  try {
    if (!Array.isArray(fileIds) || fileIds.length === 0) {
      throw new Error("No file IDs provided");
    }

    const results: {
      id?: string;
      success?: boolean;
      error?: string;
    }[] = [];

    for (const id of fileIds) {
      try {
        const result = await deleteSingleImage(id);

        if (result.success) {
          results.push({ id, success: true });
        } else {
          results.push({ id, error: result.message });
        }
      } catch (err: any) {
        results.push({
          id,
          error: err.message || "Delete failed",
        });
      }
    }

    return {
      success: true,
      message: "Delete operation completed",
      data: results,
    };
  } catch (err: any) {
    return errorMessage(err.message || "Failed to delete images");
  }
}