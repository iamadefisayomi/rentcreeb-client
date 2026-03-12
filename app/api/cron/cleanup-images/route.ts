import { sanitizeImageKitStorage } from "@/actions/imagekit";
import { NextResponse } from "next/server";

export async function GET() {
//   const result = await sanitizeImageKitStorage();
  return NextResponse.json({});
}