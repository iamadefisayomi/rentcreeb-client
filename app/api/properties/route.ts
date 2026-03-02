import { getProperties } from "@/actions/properties";
import { SearchPropertySchemaType } from "@/sections/SearchForms/formSchemas";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const page = Number(url.searchParams.get("page") || "1");  // <-- get page
    const limit = Number(url.searchParams.get("limit") || "20");
    const sortBy = url.searchParams.get("sortBy") || undefined;

    const filters = {} as unknown as SearchPropertySchemaType;

    const { properties } = await getProperties({
      filters,
      sortBy,
      limit,
      page,        // <-- pass page
      order: -1,
    });

    return NextResponse.json({ properties });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ properties: [] }, { status: 500 });
  }
}