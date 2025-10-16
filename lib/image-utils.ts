import sharp from "sharp";
import ImageKit from "imagekit";


/** Converts and optionally resizes image buffer to optimized WebP */
export async function convertToWebp(file: File): Promise<Buffer> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const image = sharp(buffer);
  const metadata = await image.metadata();

  const shouldResize = (metadata.width ?? 0) > 1080;

  return shouldResize
    ? image.resize({ width: 1080, withoutEnlargement: true }).webp({ quality: 80 }).toBuffer()
    : image.webp({ quality: 80 }).toBuffer();
}




export function getImageKit() {
  const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

  if (!publicKey || !privateKey || !urlEndpoint) {
    throw new Error("❌ Missing ImageKit environment variables");
  }

  return new ImageKit({
    publicKey,
    privateKey,
    urlEndpoint,
  });
}