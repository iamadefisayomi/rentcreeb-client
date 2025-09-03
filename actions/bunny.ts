'use server'

import path from 'path'
import axios from 'axios'
import ShortUniqueId from "short-unique-id";
import { errorMessage } from '@/constants';

const uid = new ShortUniqueId({ length: 6 });

const STORAGE_ZONE_NAME = process.env.BUNNY_STORAGE_ZONE as string
const ACCESS_KEY = process.env.BUNNY_STORAGE_API_KEY as string
const CDN_BASE_URL = process.env.BUNNY_CDN_URL as string


//
export async function uploadSingleFile(file: File) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const ext = path.extname(file.name);
    const filename = `${uid.randomUUID()}${ext}`;
    const url = `https://storage.bunnycdn.com/${STORAGE_ZONE_NAME}/${filename}`;

    const res = await axios.put(url, buffer, {
      headers: {
        AccessKey: ACCESS_KEY,
        "Content-Type": "application/octet-stream",
        "Content-Length": buffer.length,
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    if (res.status !== 201) throw new Error(`Upload failed with status ${res.status}`);

    return {
      success: true,
      message: "Image uploaded successfully",
      data: {
        id: filename,
        url: `${CDN_BASE_URL}/${filename}`,
      },
    };
  } catch (err: any) {
    return errorMessage(err.message);
  }
}

export async function uploadManyToBunny(files: File[]) {
  try {
    if (!Array.isArray(files) || files.length === 0) throw new Error("No files provided");

    const concurrencyLimit = 5;
    const results: { id?: string; url?: string; error?: string }[] = new Array(files.length);
    let currentIndex = 0;

    async function worker() {
      while (true) {
        const index = currentIndex++;
        if (index >= files.length) break;

        const file = files[index];

        try {
          const result = await uploadSingleFile(file);
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

    const workers = Array.from({ length: Math.min(concurrencyLimit, files.length) }, () => worker());
    await Promise.all(workers);

    return {
      success: true,
      data: results,
      message: ''
    };
  } catch (err: any) {
    return errorMessage(err.message);
  }
}

export async function deleteImageFromBunny(filenameOrUrl: string) {
  // Extract filename if a full URL is passed
  const filename = filenameOrUrl.includes('/')
    ? path.basename(filenameOrUrl)
    : filenameOrUrl

  const url = `https://storage.bunnycdn.com/${STORAGE_ZONE_NAME}/${filename}`

  try {
    const response = await axios.delete(url, {
      headers: {
        AccessKey: ACCESS_KEY,
      }
    })

    if (response.status === 200) {
      return ({
        success: true,
        message: 'image deleted'
      })
    } else {
      throw new Error(`Delete failed with status ${response.status}`)
    }
  } catch (error: any) {
    return errorMessage(error.message)
  }
}