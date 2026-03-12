import { getCurrentUser } from "@/actions/auth";
import { NEXT_PUBLIC_BASE_URL } from "@/constants";
import Inspection from "@/server/schema/Inspections";
import Property from "@/server/schema/Property";
import axiosInstance from "@/utils/axiosInstance";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const maxDuration = 60;

export async function GET(req: NextRequest) {
  try {
    const { data: user, success } = await getCurrentUser();
    if (!success || !user) throw new Error("Invalid request");

    const { verifyInspectionPayment } = await import("@/actions/subscription");

    const { searchParams } = new URL(req.url);

    const reference = searchParams.get("reference") || "";
    const propertyId = searchParams.get("propertyId") || "";
    const inspectionDate = searchParams.get("date") || "";
    const inspectionTime = searchParams.get("time") || "";
    const userMessage = searchParams.get("message") || "";

    if (!reference || !propertyId)
      throw new Error("Missing reference or property ID");

    const property = await Property.findById(propertyId)
      .select("title address userId")
      .populate({
        path: "userId",
        select: "name email",
      })
      // .lean();

    if (!property) throw new Error("Property not found");

    const { success: verifySuccess, data } =
      await verifyInspectionPayment(reference, propertyId);

    if (!verifySuccess || !data) throw new Error("Payment verification failed");

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

    /**
     * Send email asynchronously (non-blocking)
     */
    axiosInstance.post("/email/trigger", {
        to: property.userId.email,
        subject: `New Inspection Request from ${user.name}`,
        template: "inspection",
        data: {
          agentName: property.userId.name,
          date: inspectionDate,
          propertyId: property.title,
          renterName: user.name,
          time: inspectionTime,
        }
    })

    const base = NEXT_PUBLIC_BASE_URL;

    return NextResponse.redirect(
      `${base}/inspection/successful?reference=${data.reference}` +
        `&paid_at=${data.paid_at}` +
        `&code=${inspectionDoc.verificationCode}` +
        `&propertyId=${property._id}` +
        `&property_title=${property.title}` +
        `&date=${inspectionDate}` +
        `&location=${property.address}` +
        `&time=${inspectionTime}` +
        `&message=${encodeURIComponent(userMessage)}` +
        `&agent=${encodeURIComponent(property.userId.name)}`
    );
  } catch (err: any) {
    console.log(err.message);

    return NextResponse.redirect(
      `${NEXT_PUBLIC_BASE_URL}/inspection/successful?error=${encodeURIComponent(
        err?.message || "Unknown error"
      )}`
    );
  }
}