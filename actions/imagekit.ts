"use server";

import ShortUniqueId from "short-unique-id";
import { errorMessage } from "@/constants";
import { convertToWebp, getImageKit } from "@/lib/image-utils"; // renamed for clarity

const uid = new ShortUniqueId({ length: 6 });

// ============ utility functions =================
const MAX_SIZE = 3 * 1024 * 1024; // 3MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

function validateFile(file: File): void {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(`Unsupported file type: ${file.type}`);
  }
  if (file.size > MAX_SIZE) {
    throw new Error(`File too large (max 3MB): ${file.name}`);
  }
}

function getSafeFilename(file: File): string {
  // Always enforce .webp extension since we optimize everything
  const baseName = uid.randomUUID();
  return `${baseName}.webp`;
}

// ==============================================

/*
  Uploads a single property image to ImageKit
 */
export async function uploadSingleImage(file: File) {
  try {
    validateFile(file);

    // Convert to optimized WebP before upload
    const webpBuffer = await convertToWebp(file);
    const filename = getSafeFilename(file);
    const imagekit = getImageKit()

    const res = await imagekit.upload({
      file: webpBuffer, // binary buffer
      fileName: filename,
      useUniqueFileName: false, // we’re already generating safe unique names
    });

    return {
      success: true,
      message: "Image uploaded successfully",
      data: {
        id: res.fileId,
        url: res.url, // optimized CDN URL
        thumbnail: res.thumbnailUrl, // useful for grid preview
      },
    };
  } catch (err: any) {
    return errorMessage(err.message || "Image upload failed");
  }
}


/**
 * Upload multiple property images to ImageKit
 * - Validates and optimizes each image
 * - Uploads with concurrency limit (5 workers)
 */
export async function uploadManyImages(files: File[]) {
  try {
    if (!Array.isArray(files) || files.length === 0) {
      throw new Error("No files provided");
    }

    const concurrencyLimit = 5;
    const results: { id?: string; url?: string; thumbnail?: string; error?: string }[] = new Array(files.length);
    let currentIndex = 0;

    async function worker() {
      while (true) {
        const index = currentIndex++;
        if (index >= files.length) break;

        const file = files[index];
        try {
          const result = await uploadSingleImage(file);

          if (result.success) {
            results[index] = result.data;
          } else {
            results[index] = { error: result.message };
          }
        } catch (err: any) {
          results[index] = { error: err.message || "Unknown error" };
        }
      }
    }

    // Spawn workers
    const workers = Array.from(
      { length: Math.min(concurrencyLimit, files.length) },
      () => worker()
    );

    await Promise.all(workers);

    return {
      success: true,
      data: results,
      message: "Images uploaded successfully",
    };
  } catch (err: any) {
    return errorMessage(err.message || "Failed to upload images");
  }
}

/**
 * Delete a single image from ImageKit by fileId
 */
export async function deleteSingleImage(fileId: string) {
  try {
    if (!fileId) throw new Error("File ID is required");
    const imagekit = getImageKit()

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

/**
 * Delete multiple images from ImageKit
 */
export async function deleteManyImages(fileIds: string[]) {
  try {
    if (!Array.isArray(fileIds) || fileIds.length === 0) {
      throw new Error("No file IDs provided");
    }

    const results: { id?: string; success?: boolean; error?: string }[] = [];

    for (const id of fileIds) {
      try {
        const result = await deleteSingleImage(id);
        if (result.success) {
          results.push({ id, success: true });
        } else {
          results.push({ id, error: result.message });
        }
      } catch (err: any) {
        results.push({ id, error: err.message || "Unknown error" });
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