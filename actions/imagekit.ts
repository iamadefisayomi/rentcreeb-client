"use server";

import ShortUniqueId from "short-unique-id";
import { errorMessage } from "@/constants";
import { convertToWebp, getImageKit } from "@/lib/image-utils";
import sharp from "sharp";
import fs from "fs";
import path from "path";
import { dbConnection } from "@/lib/dbConnection";
import Property from "@/server/schema/Property";


const uid = new ShortUniqueId({ length: 6 });

const MAX_SIZE = 5 * 1024 * 1024;

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

const logoPath = path.join(process.cwd(), "public", "rentcreeb-watermark.png");

async function addWatermark(buffer: Buffer) {
  const image = sharp(buffer);
  const metadata = await image.metadata();

  const width = metadata.width || 800;
  const height = metadata.height || 600;

  // Skip watermark on very small images
  if (width < 300 || height < 300) {
    return buffer;
  }

  const logoBuffer = fs.readFileSync(logoPath);

  // Logo size relative to image
  const logoWidth = Math.round(width * 0.35);

  const resizedLogo = await sharp(logoBuffer)
    .resize({ width: logoWidth })
    .png()
    .toBuffer();

  const fontSize = Math.round(width * 0.04);

  const svg = `
  <svg width="${width}" height="${height}">
    <defs>
      <filter id="shadow">
        <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="black" flood-opacity="0.5"/>
      </filter>
    </defs>

    <!-- Text -->
    <text
      x="50%"
      y="60%"
      text-anchor="middle"
      font-size="${fontSize}"
      font-family="Poppins, Arial, sans-serif"
      fill="white"
      opacity="0.35"
      filter="url(#shadow)"
      font-weight="600"
    >
      Posted on Rentcreeb
    </text>
  </svg>
  `;

  return image
    .composite([
      {
        input: await sharp(resizedLogo)
          .ensureAlpha(0.25) // logo transparency
          .toBuffer(),
        gravity: "center",
      },
      {
        input: Buffer.from(svg),
        top: 0,
        left: 0,
      },
    ])
    .toBuffer();
}



/*
 Upload single base64 image
*/
export async function uploadSingleImage(base64: string) {
  try {
    const buffer = parseBase64(base64);

    // add watermark first
    const watermarked = await addWatermark(buffer);

    // convert to webp
    const webpBuffer = await convertToWebp(watermarked);

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


const BATCH_LIMIT = 100;

export async function sanitizeImageKitStorage() {
  try {
    await dbConnection();

    const imagekit = getImageKit();

    /** ---------------- GET ALL IMAGES FROM IMAGEKIT ---------------- */
    let allImageKitFiles: any[] = [];
    let skip = 0;

    while (true) {
      const files = await imagekit.listFiles({
        limit: BATCH_LIMIT,
        skip,
      });

      if (!files || files.length === 0) break;

      allImageKitFiles.push(...files);

      if (files.length < BATCH_LIMIT) break;

      skip += BATCH_LIMIT;
    }

    /** ---------------- GET ALL IMAGE IDS FROM DATABASE ---------------- */
    const properties = await Property.find({}, { images: 1 }).lean();

    const dbImageIds = new Set<string>();

    for (const property of properties) {
      if (!property.images) continue;

      for (const img of property.images) {
        if (img?.id) {
          dbImageIds.add(img.id);
        }
      }
    }

    /** ---------------- FIND ORPHANED IMAGES ---------------- */
    const orphanImages = allImageKitFiles.filter(
      (file) => !dbImageIds.has(file.fileId)
    );

    /** ---------------- DELETE ORPHANED ---------------- */
    const deleted: string[] = [];
    const failed: string[] = [];

    for (const file of orphanImages) {
      try {
        await imagekit.deleteFile(file.fileId);
        deleted.push(file.fileId);
      } catch {
        failed.push(file.fileId);
      }
    }

    return {
      success: true,
      message: "ImageKit storage sanitized",
      stats: {
        totalFiles: allImageKitFiles.length,
        referenced: dbImageIds.size,
        deleted: deleted.length,
        failed: failed.length,
      },
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || "Sanitization failed",
    };
  }
}