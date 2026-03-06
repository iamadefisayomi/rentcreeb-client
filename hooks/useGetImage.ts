import { errorMessage } from "../constants";

/** ----------------- Types ----------------- */
export type ImageResponse<T = File | File[]> = {
  success: boolean;
  data: T | null;
  message: string | null;
};

/** ----------------- Constants ----------------- */
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

/** ----------------- Helpers ----------------- */
function validateFile(file: File): void {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(`Unsupported file type: ${file.type}`);
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File too large (max ${MAX_FILE_SIZE / (1024 * 1024)}MB): ${file.name}`);
  }
}

/** ----------------- Get Single Image ----------------- */
export function getSingleImage(e: React.ChangeEvent<HTMLInputElement>): ImageResponse<File> {
  try {
    const file = e.target.files?.[0];
    if (!file) return { success: false, data: null, message: "No file selected" };

    validateFile(file);

    return { success: true, data: file, message: null };
  } catch (err: any) {
    return errorMessage(err.message);
  }
}

/** ----------------- Get Multiple Images ----------------- */
export function getMultipleImages(e: React.ChangeEvent<HTMLInputElement>): ImageResponse<File[]> {
  try {
    const files = e.target.files;
    if (!files || files.length === 0) return { success: false, data: null, message: "No files selected" };

    const validFiles = Array.from(files)
      .filter(file => file.type.startsWith("image/"))
      .map((file) => {
        validateFile(file);
        return file;
      });

    if (validFiles.length === 0) return { success: false, data: null, message: "No valid images found" };

    return { success: true, data: validFiles, message: null };
  } catch (err: any) {
    return errorMessage(err.message);
  }
}