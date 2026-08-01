import { NextRequest, NextResponse } from "next/server";
import { dbConnection } from "@/lib/dbConnection";
import { Verification } from "@/server/schema/Verification";
import { revalidatePath } from "next/cache";
import Routes from "@/Routes";
import { getCurrentUser } from "@/actions/auth";

const PREMBLY_API_KEY = process.env.PREMBLY_API_KEY!;
const PREMBLY_BASE_URL = "https://api.prembly.com";

export interface PremblyResult {
  verificationId: string;
  faceMatchScore: number;
  verificationStatus: "verified" | "failed";
  rawResponse: any;
}

interface ProcessVerificationInput {
  userId: string;
  nin: string;
  image: string; // base64
}

export async function POST(req: NextRequest) {
  try {
    const getUser = await getCurrentUser()
    if (!getUser.success && getUser.message) throw new Error(getUser.message)
        const user = getUser.data
        // 
    const body: ProcessVerificationInput = await req.json();

    if (!body.nin || !body.image) {
      return NextResponse.json(
        { error: "userId, nin and image are required" },
        { status: 400 }
      );
    }

    await dbConnection();

    // 1️⃣ Create initial verification record
    const verification = await Verification.create({
      userId: user.id,
      nin: body.nin,
      image: body.image,
      status: "pending",
    });

    // 2️⃣ Send request to Prembly
    const response = await fetch(`${PREMBLY_BASE_URL}/identitypass/verification/nin_w_face`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${PREMBLY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nin: body.nin, image: body.image }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Prembly verification failed: ${text}`);
    }

    const premResultData = await response.json();
    const faceMatchScore = premResultData?.faceMatchScore ?? 0;
    const verificationStatus: "verified" | "failed" = faceMatchScore >= 0.8 ? "verified" : "failed";

    // 3️⃣ Update DB record
    verification.status = verificationStatus;
    verification.premResult = premResultData;
    await verification.save();

    // 4️⃣ Revalidate dashboard path
    revalidatePath(Routes.dashboard["account management"]["account information"]);

    const result: PremblyResult = {
      verificationId: verification._id.toString(),
      faceMatchScore,
      verificationStatus,
      rawResponse: premResultData,
    };

    return NextResponse.json(result);

  } catch (error: any) {
    console.error("Prembly API error:", error);

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}