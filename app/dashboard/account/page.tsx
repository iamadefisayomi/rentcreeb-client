import AccountInformation from "@/sections/dashboard/AccountInformation";
import { Metadata } from "next";
import Verification, { TrustScore } from "./Verification";
import { getCurrentUser, getUserTrustScore } from "@/actions/auth";
import { BetterAuthUser } from "@/types/betterAuthType";

export const metadata: Metadata = {
    title: "Account - Profile",
    description: "Manage all your activities here",
  };
  

export default async function Page () {
  const user = await (await getCurrentUser()).data
  const userScore = (await getUserTrustScore()).data
    return (
      <div className="w-full flex flex-col gap-4">
        {user?.role === 'agent' && <Verification title="identity verification" userScore={userScore?.score} />}
        {user?.role === 'agent' && <TrustScore userScore={userScore?.score} />}
        <AccountInformation title="account information" user={user as BetterAuthUser}/>
      </div>
    )
}