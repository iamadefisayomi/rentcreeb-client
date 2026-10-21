import { NextRequest, NextResponse } from "next/server";
import { dbConnection } from "@/lib/dbConnection";
import Waitlist from "@/server/schema/WaitListModel";
import { auth } from "@/auth";
import { headers } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
              headers: await headers()
          })

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    if (session.user.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "Forbidden",
        },
        { status: 403 }
      );
    }

    await dbConnection();

    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search")?.trim() || "";
    const role = searchParams.get("role")?.trim() || "";
    const state = searchParams.get("state")?.trim() || "";

    const page = Math.max(
      Number(searchParams.get("page")) || 1,
      1
    );

    const limit = Math.min(
      Math.max(Number(searchParams.get("limit")) || 20, 1),
      100
    );

    const skip = (page - 1) * limit;

    // ------------------------------------------
    // Filters
    // ------------------------------------------

    const query: Record<string, any> = {};

    if (search) {
      query.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          email: {
            $regex: search,
            $options: "i",
          },
        },
        {
          phone: {
            $regex: search,
            $options: "i",
          },
        },
        {
          city: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    if (role) {
      query.iAm = role;
    }

    if (state) {
      query.state = state;
    }

    // ------------------------------------------
    // Fetch data + statistics
    // ------------------------------------------

    const [
      users,
      total,
      totalSignups,
      landlords,
      renters,
      artisans,
      developers,
      states,
    ] = await Promise.all([
      Waitlist.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Waitlist.countDocuments(query),

      Waitlist.countDocuments(),

      Waitlist.countDocuments({
        iAm: "landlord",
      }),

      Waitlist.countDocuments({
        iAm: "renter / tenant",
      }),

      Waitlist.countDocuments({
        iAm: "artisan / service provider",
      }),

      Waitlist.countDocuments({
        iAm: "property developer",
      }),

      Waitlist.distinct("state"),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,

      stats: {
        total: totalSignups,
        landlords,
        renters,
        artisans,
        developers,
      },

      users,

      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },

      states: states.filter(Boolean).sort(),
    });
  } catch (error) {
    console.error("Admin waitlist error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch waitlist.",
      },
      {
        status: 500,
      }
    );
  }
}