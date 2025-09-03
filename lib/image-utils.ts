import sharp from "sharp";

/** Converts and optionally resizes image buffer to optimized WebP */
export async function convertToWebp(buffer: Buffer): Promise<Buffer> {
  const image = sharp(buffer);
  const metadata = await image.metadata();

  const shouldResize = (metadata.width ?? 0) > 1080;

  return shouldResize
    ? image.resize({ width: 1080, withoutEnlargement: true }).webp({ quality: 80 }).toBuffer()
    : image.webp({ quality: 80 }).toBuffer();
}