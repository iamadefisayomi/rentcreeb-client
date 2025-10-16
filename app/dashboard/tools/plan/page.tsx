import { getCurrentUserSubscription } from "@/actions/subscription";
import PaymentPlan from "@/sections/PaymentPlan";
import { paystackAxios } from "@/utils/paystackAxios";
import { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export const metadata: Metadata = {
  title: "Subscription Plans",
  description: "Manage all your activities here",
};

export default async function Page() {
  let activePlans: any[] = [];
  let subscription: any = null;

  try {
    const { data } = await paystackAxios.get("/plan");
    const plans = data?.data || [];
    activePlans = plans.filter(
      (plan: any) => !plan.is_deleted && !plan.is_archived
    );
  } catch (err: any) {
    console.error("⚠️ Paystack fetch failed during build:", err.message);
  }

  try {
    const res = await getCurrentUserSubscription();
    subscription = res.data;
  } catch (err: any) {
    console.error("⚠️ Subscription fetch failed:", err.message);
  }

  return (
    <PaymentPlan
      title="my plan"
      plans={(activePlans || []) as any}
      subscription={subscription || {}}
    />
  );
}
