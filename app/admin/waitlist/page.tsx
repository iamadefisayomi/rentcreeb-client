import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import WaitlistDashboard from "./WaitlistDashboard";

export default async function AdminWaitlistPage() {
  const session = await auth.api.getSession({
            headers: await headers()
        })

  if (!session?.user) {
    redirect("/signin");
  }

  if (session.user.role !== "admin") {
    redirect("/");
  }

  return <WaitlistDashboard />;
}