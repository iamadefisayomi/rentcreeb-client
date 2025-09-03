import { getCurrentUserSubscription } from "@/actions/subscription";
import Plan from "@/sections/dashboard/Plan";
import { paystackAxios } from "@/utils/paystackAxios";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Tools - Plan",
    description: "Manage all your activities here",
  };
  

export default async function Page () {
    const plans = (await paystackAxios.get('/plan')).data.data
    const activePlans = plans.filter((plan: any) => !plan.is_deleted && !plan.is_archived)
    const subscription = await (await getCurrentUserSubscription()).data
    console.log(subscription, '----suc')
    return <Plan title="my plan" plans={activePlans || []} subscription={subscription as any} />
}