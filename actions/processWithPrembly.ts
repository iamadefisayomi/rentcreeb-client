"use server";

import { dbConnection } from "@/lib/dbConnection";
import Routes from "@/Routes";
import { Verification } from "@/server/schema/Verification";
import { revalidatePath } from "next/cache";

const PREMBLY_API_KEY = process.env.PREMBLY_API_KEY!;
const PREMBLY_BASE_URL = "https://api.prembly.com"; // Prembly API base

// ✅ Strongly typed Prembly result
export interface PremblyResult {
  verificationId: string; // DB record _id
  faceMatchScore: number; // 0-1
  verificationStatus: "verified" | "failed";
  rawResponse: any; // Full Prembly JSON
}

// Input for verification
interface ProcessVerificationInput {
  userId: string;
  nin: string;
  image: string; // base64 image string
}

export async function processWithPrembly({ userId, nin, image }: ProcessVerificationInput): Promise<PremblyResult> {
  // Ensure DB is connected
  await dbConnection();

  // 1️⃣ Create initial verification record
  const verification = await Verification.create({
    userId,
    nin,
    image,
    status: "pending",
  });

  try {
    // 2️⃣ Send NIN + face image to Prembly
    const response = await fetch(`${PREMBLY_BASE_URL}/identitypass/verification/nin_w_face`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${PREMBLY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nin, image }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Prembly verification failed: ${text}`);
    }

    const premResultData = await response.json();
    console.log("Prembly result:", premResultData);

    // 3️⃣ Extract face match score safely
    const faceMatchScore = premResultData?.faceMatchScore ?? 0;
    const verificationStatus: "verified" | "failed" = faceMatchScore >= 0.8 ? "verified" : "failed";

    // 4️⃣ Update verification record
    verification.status = verificationStatus;
    verification.premResult = premResultData;
    await verification.save();

    // 5️⃣ Revalidate Next.js path (dashboard)
    revalidatePath(Routes.dashboard["account management"]["account information"]);

    return {
      verificationId: verification._id.toString(),
      faceMatchScore,
      verificationStatus,
      rawResponse: premResultData,
    };

  } catch (error: any) {
    console.error("Prembly error:", error);

    // Update DB record on failure
    verification.status = "failed";
    verification.premResult = { error: error.message };
    await verification.save();

    return {
      verificationId: verification._id.toString(),
      faceMatchScore: 0,
      verificationStatus: "failed",
      rawResponse: { error: error.message },
    };
  }
}