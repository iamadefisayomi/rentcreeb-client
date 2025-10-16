import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { auth } = await import("@/auth");
  const { toNextJsHandler } = await import("better-auth/next-js");
  const { GET: handlerGET } = toNextJsHandler(auth);
  return handlerGET(req);
}

export async function POST(req: NextRequest) {
  const { auth } = await import("@/auth");
  const { toNextJsHandler } = await import("better-auth/next-js");
  const { POST: handlerPOST } = toNextJsHandler(auth);
  return handlerPOST(req);
}