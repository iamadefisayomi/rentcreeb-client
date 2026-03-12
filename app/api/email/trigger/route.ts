import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/actions/sendEmail";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {to, subject, template, data} = body

    await sendEmail({to, subject, template, data});

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email background job failed:", error);
    return NextResponse.json({ success: false });
  }
}