import { getCurrentUser } from "@/actions/auth";
import { sendEmail } from "@/actions/sendEmail";
import { NEXT_PUBLIC_BASE_URL } from "@/constants";
import Inspection from "@/server/schema/Inspections";
import Property from "@/server/schema/Property";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Get current logged-in user
    const { data: user, success, message } = await getCurrentUser();
    if (!success || !user) throw new Error("Invalid request!");

    // Lazy import verification
    const { verifyInspectionPayment } = await import("@/actions/subscription");
    const base = NEXT_PUBLIC_BASE_URL;

    // Get query params
    const { searchParams } = new URL(req.url);
    const reference = searchParams.get("reference") || "";
    const propertyId = searchParams.get("propertyId") || "";
    const inspectionDate = searchParams.get("date") || "";
    const inspectionTime = searchParams.get("time") || "";
    const userMessage = searchParams.get("message") || "";

    if (!reference || !propertyId) throw new Error("Missing reference or property ID");

    const property = await Property.findById(propertyId)
      .populate({ path: "userId", select: "name email username image", options: { lean: true } });
    // Verify payment
    const { success: verifySuccess, message: verifyMessage, data } = await verifyInspectionPayment(reference, propertyId);

    if (verifySuccess && data) {
      // Create Inspection in DB
      const inspectionDoc = await Inspection.create({
        propertyId: property._id,
        userId: user.id,
        agentId: property.userId._id,
        reference: data.reference,
        amount: data.amount,
        currency: data.currency,
        paidAt: new Date(data.paid_at),
        inspectionDate,
        inspectionTime,
        message: userMessage,
        status: "confirmed",
      });

       await sendEmail({
            to: property.userId.email,
            subject: ` New Inspection Request from ${user.name}`,
            template: "inspection",
            data: {
              agentName: property.userId.name,
              date: inspectionDate,
              propertyId: property.title,
              renterName: user.name,
              time: inspectionTime,
            }
          })

      // Redirect to success page with inspection details
      return NextResponse.redirect(
        `${base}/inspection/successful?reference=${data.reference}` +
        `&paid_at=${data.paid_at}` +
        `&code=${inspectionDoc.verificationCode}` +
        `&propertyId=${property._id}` +
        `&date=${inspectionDate}` +
        `&location=${property.address}` +
        `&time=${inspectionTime}` +
        `&message=${encodeURIComponent(userMessage)}` +
        `&agent=${encodeURIComponent(property.userId.name)}`
      );
    } else {
      return NextResponse.redirect(
        `${base}/inspection/successful/?error=${encodeURIComponent(verifyMessage)}`
      );
    }
  } catch (err: any) {
    console.log(err.message)
    return NextResponse.redirect(
      `${NEXT_PUBLIC_BASE_URL}/${err?.message ? encodeURIComponent(err.message) : "Unknown error"}`
    );
  }
}