import { getCurrentUser } from "@/actions/auth";
import { getProperties } from "@/actions/properties";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

export async function GET(req: NextRequest) {
  try {
    // const user = await getCurrentUser()
    // if (!user) throw new Error("invalid request!")
    //   // 
    const url = new URL(req.url);
    const page = Number(url.searchParams.get("page") || "1");
    const limit = Number(url.searchParams.get("limit") || "20");

    const filters: Record<string, any> = {};
    url.searchParams.forEach((value, key) => {
      if (!["page", "limit"].includes(key)) filters[key] = value;
    });

    const { properties } = await getProperties({
      filters,
      limit,
      page,
    });

    return NextResponse.json({ properties });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ properties: [] }, { status: 500 });
  }
}