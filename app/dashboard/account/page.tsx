import AccountInformation from "@/sections/dashboard/AccountInformation";
import { Metadata } from "next";
import Verification, { TrustScore } from "./Verification";
import { getCurrentUser, getUserTrustScore } from "@/actions/auth";
import { BetterAuthUser } from "@/types/betterAuthType";
import { redirect } from "next/navigation";
import Routes from "@/Routes";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Account - Profile",
  description: "Manage all your activities here",
};

export default async function Page() {
  const userResponse = await getCurrentUser();
  const user = userResponse?.data;
  const userScoreResponse = await getUserTrustScore();
  const userScore = userScoreResponse?.data;

  if (!user) {return redirect(Routes.login)}

  return (
    <div className="w-full flex flex-col gap-4">
      {user?.role === "agent" && (
        <>
          <Verification title="identity verification" userScore={userScore?.score} />
          <TrustScore userScore={userScore?.score} />
        </>
      )}
      <AccountInformation title="account information" user={user as BetterAuthUser} />
    </div>
  );
}
