"use server"

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  api_key:    process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

interface UploadResult {
  url: string;
  public_id: string;
}

export async function uploadImageWithCloudinary(file: File): Promise<UploadResult> {
  // Convert File to Buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: "image",
          folder: "uploads",             // optional: store in a folder
          format: "jpg",                 // optional: enforce format
          // you can add tags, transformations, public_id etc. here
        },
        (error, result) => {
          if (error || !result) {
            return reject(error || new Error("Upload result was undefined"));
          }
          resolve({
            url: result.secure_url,
            public_id: result.public_id
          });
        }
      )
      .end(buffer);
  });
}