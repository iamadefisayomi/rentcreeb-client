import { errorMessage } from "../constants";

// Improved TypeScript Types
type ImageResponse = {
  success: boolean;
  data: File | string | null;
  message: string | null;
}

// Improved error handling and type safety for image upload and deletion functions
export function getSingleImage(e: React.ChangeEvent<HTMLInputElement>) {
  try {
    const imageData = e.target.files?.[0];
    if (imageData && imageData.type.startsWith('image/')) {
      return {
        success: true,
        data: imageData,
        message: null
      };
    } else {
      throw new Error('Only images are supported');
    }
  } catch (err: any) {
    return errorMessage(err.message);
  }
}

export function getMultipleImages(e: React.ChangeEvent<HTMLInputElement>) {
  try {
    const imageFiles = e.target.files;
    
    if (!imageFiles || imageFiles.length === 0) {
      throw new Error('No images selected');
    }

    const validImages = Array.from(imageFiles).filter(file => file.type.startsWith('image/'));

    if (validImages.length === 0) {
      throw new Error('Only images are supported');
    }

    return {
      success: true,
      data: validImages, // Returns an array of images
      message: null
    };
  } catch (err: any) {
    return errorMessage(err.message);
  }
}
