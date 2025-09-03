// app/api/nigeria-states-lga-city/route.ts
import { NextRequest, NextResponse } from "next/server";
import { dbConnection } from "@/lib/dbConnection";
import { NigeriaStatesLgaCity } from "@/server/schema/StatesData";
import { errorMessage, NEXT_PUBLIC_BASE_URL } from "@/constants";

// Define allowed origin(s) for extra security
const ALLOWED_ORIGINS = [
  NEXT_PUBLIC_BASE_URL,
  "http://localhost:3000", // Local development
];

export async function GET(req: NextRequest) {
  try {
    // --- Security: Block requests from other origins ---
    const origin = req.headers.get("origin") || "";
    const referer = req.headers.get("referer") || "";

    const isAllowed =
      ALLOWED_ORIGINS.includes(origin) ||
      ALLOWED_ORIGINS.some((allowed) => referer.startsWith(allowed));

    if (!isAllowed) {
      return NextResponse.json(
        { success: false, message: "Unauthorized request" },
        { status: 403 }
      );
    }

    // --- Connect to Database ---
    await dbConnection();

    // --- Fetch Data ---
    const data = await NigeriaStatesLgaCity.find().lean();

    return NextResponse.json({
      success: true,
      message: "All Nigeria states and cities",
      data,
    });
  } catch (err: any) {
    return NextResponse.json(errorMessage(err.message), { status: 500 });
  }
}
