import { NextRequest, NextResponse } from "next/server";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import path from "path";
import os from "os";
import fs from "fs/promises";
import { randomUUID } from "crypto";
import ShortUniqueId from "short-unique-id";
import { getImageKit } from "@/lib/image-utils";
import { PropertyVideoDetails } from "@/remotion/PropertyVideo";

export const runtime = "nodejs";
export const maxDuration = 300;

const uid = new ShortUniqueId({ length: 6 });

let bundleLocationPromise: Promise<string> | null = null;
function getBundleLocation() {
  if (!bundleLocationPromise) {
    bundleLocationPromise = bundle({
      entryPoint: path.join(process.cwd(), "remotion", "index.ts"),
      webpackOverride: (config) => config,
    });
  }
  return bundleLocationPromise;
}

type RenderRequestBody = {
  title: string;
  description?: string;
  type: string;
  listedIn: string;
  price: number;
  paymentFrequency?: "yearly" | "quarterly" | "monthly";
  bedrooms: number;
  bathrooms: number;
  kitchens: number;
  parking: number;
  floorArea?: number;
  landArea?: number;
  furnished?: string;
  city: string;
  state: string;
  country: string;
  address: string;
  ownerName?: string;
  ownerContact?: string;
  images: string[];
};

function isValidBody(body: unknown): body is RenderRequestBody {
  const b = body as RenderRequestBody;
  return (
    !!b &&
    typeof b.title === "string" &&
    typeof b.price === "number" &&
    Array.isArray(b.images) &&
    b.images.length > 0 &&
    b.images.every((i) => typeof i === "string")
  );
}

export async function POST(req: NextRequest) {
  const workDir = path.join(os.tmpdir(), `property-video-${randomUUID()}`);

  try {
    const body = await req.json();

    if (!isValidBody(body)) {
      return NextResponse.json(
        {
          error:
            "Invalid payload. Expecting the property object with a non-empty 'images' array of URLs.",
        },
        { status: 400 }
      );
    }

    const details: PropertyVideoDetails = {
      title: body.title,
      description: body.description,
      type: body.type,
      listedIn: body.listedIn,
      price: body.price,
      paymentFrequency: body.paymentFrequency,
      bedrooms: body.bedrooms,
      bathrooms: body.bathrooms,
      kitchens: body.kitchens,
      parking: body.parking,
      floorArea: body.floorArea,
      landArea: body.landArea,
      furnished: body.furnished,
      city: body.city,
      state: body.state,
      country: body.country,
      address: body.address,
      ownerName: body.ownerName,
      ownerContact: body.ownerContact,
    };

    const images = body.images.slice(0, 15);
    const inputProps = { images, details };

    await fs.mkdir(workDir, { recursive: true });
    const bundleLocation = await getBundleLocation();

    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id: "PropertyVideo",
      inputProps,
    });

    const outputPath = path.join(workDir, "output.mp4");

    await renderMedia({
      composition,
      serveUrl: bundleLocation,
      codec: "h264",
      outputLocation: outputPath,
      inputProps,
    });

    // Upload rendered video to ImageKit
    const videoBuffer = await fs.readFile(outputPath);
    const imagekit = getImageKit();

    const filename = `${uid.randomUUID()}.mp4`;

    const uploadResult = await imagekit.upload({
      file: videoBuffer,
      fileName: filename,
      folder: "/property-videos",
      useUniqueFileName: false,
    });

    return NextResponse.json({
      success: true,
      url: uploadResult.url,
      thumbnail: uploadResult.thumbnailUrl,
      fileId: uploadResult.fileId,
      size: uploadResult.size,
    });
  } catch (err) {
    console.error("Render failed:", err);
    return NextResponse.json(
      { error: "Failed to render video", detail: String(err) },
      { status: 500 }
    );
  } finally {
    fs.rm(workDir, { recursive: true, force: true }).catch(() => {});
  }
}