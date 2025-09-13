import { getCurrentUserSubscription } from "@/actions/subscription";
import PaymentPlan from "@/sections/PaymentPlan";
import { paystackAxios } from "@/utils/paystackAxios";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Subscription Plans",
    description: "Manage all your activities here",
  };
  

export default async function Page () {
    const plans = (await paystackAxios.get('/plan')).data.data
    const activePlans = plans.filter((plan: any) => !plan.is_deleted && !plan.is_archived)
    const subscription = await (await getCurrentUserSubscription()).data
    return <PaymentPlan title="my plan" plans={activePlans || []} subscription={subscription as any} />
}