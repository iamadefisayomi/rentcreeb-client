import { auth } from "@/auth";
import { headers } from "next/headers";

export async function requireAdmin() {
  const session = await auth.api.getSession({
          headers: await headers()
      })

  if (!session?.user) {
    throw new Error("UNAUTHORIZED");
  }

  if (session.user.role !== "admin") {
    throw new Error("FORBIDDEN");
  }

  return session;
}