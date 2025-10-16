import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { verifySubTransaction } = await import("@/actions/subscription");
  const Routes = (await import("@/Routes")).default || (await import("@/Routes"));
  // optional to guard environment var
  const base = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";
  const planPath = Routes.dashboard["professional tools"]["my plan"].replace(/^\//, "");

  // now the rest remains
  try {
    const { searchParams } = new URL(req.url);
    const reference = searchParams.get("reference") || "";

    const { success, message, data } = await verifySubTransaction(reference);

    if (success && data) {
      const { name, amount, email, currency, paid_at } = data;
      return NextResponse.redirect(
        `${base}/transaction/successful?reference=${reference}&name=${name}&amount=${amount}&email=${email}&currency=${currency}&paid_at=${paid_at}`
      );
    } else {
      return NextResponse.redirect(
        `${base}/${planPath}/?error=${encodeURIComponent(message)}`
      );
    }
  } catch (err: any) {
    return NextResponse.redirect(
      `${base}/${planPath}/?error=${encodeURIComponent(err.message)}`
    );
  }
}
