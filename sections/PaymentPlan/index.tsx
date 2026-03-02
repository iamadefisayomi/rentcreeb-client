"use client";

import { initSubTransaction } from "@/actions/subscription";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import useAlert from "@/hooks/useAlert";
import currency from "currency.js";
import { useRouter } from "next/navigation";
import { useState } from "react";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import CancelSubscription from "./cancelSubscription";

dayjs.extend(advancedFormat);

export default function PaymentPlan({
  title,
  plans,
  subscription,
}: {
  title: string;
  plans?: any[] | null;
  subscription?: any;
}) {
  const [open, setOpen] = useState(false);

  const currentPlanName = subscription?.plan?.name ?? "Free";
  const amount = subscription?.amount ?? 0;
  const interval = subscription?.interval ?? "monthly";
  const status = subscription?.status ?? "inactive";

  return (
    <>
      <h2 className="text-xs font-semibold capitalize pb-4">{title}</h2>

      <div className="w-full flex flex-col gap-10">
        {/* Current Plan */}
        <div className="grid md:grid-cols-2 grid-cols-1 border rounded-md">
          <div className="flex flex-col gap-2 p-5">
            <h4 className="text-xs font-semibold text-slate-800 capitalize">
              Current Plan ({currentPlanName})
            </h4>

            <p className="text-muted-foreground text-[11px] ">
              {currentPlanName.toLowerCase() === "free"
                ? "Basic access to RentCreeb property listings and landlord tools."
                : "Full access to premium RentCreeb features including priority listing placement and unlimited leads."}
            </p>
          </div>

          <div className="flex items-start gap-2 p-5 md:border-l border-t md:border-t-0">
            <h1 className="text-3xl font-bold text-slate-800">
              {amount > 0 ? formatShortNaira(amount / 100) : "Free"}
            </h1>

            <div className="flex flex-col gap-2">
              <h4 className="text-xs font-semibold text-slate-800 capitalize">
                {interval} Plan
              </h4>

              {subscription?.expiresAt && (
                <p className="text-muted-foreground text-[11px] ">
                  Your subscription renews{" "}
                  <span className="font-semibold text-slate-600">
                    {dayjs(subscription.expiresAt).format("MMMM Do, YYYY")}
                  </span>
                </p>
              )}

              {currentPlanName === "Free" ? null : status === "active" ? (
                <CancelSubscription subscription={subscription} setOpen={setOpen} />
              ) : (
                <p className="text-[10px] font-medium text-primary">
                  Subscription is cancelled or expired
                </p>
              )}
            </div>
          </div>
        </div>

        {/* All Plans */}
        <div className="w-full grid md:grid-cols-3 grid-cols-1 gap-4">

          {/* Free Plan */}
          <RateCard
            title="Free Plan"
            amount={0}
            plan="free"
            description="Post up to 2 property listings and receive inquiries from potential tenants."
            benefits={[
              "2 free property listings",
              "Basic landlord dashboard",
              "Email notifications for new leads",
            ]}
            disabled={currentPlanName === "Free"}
          />

          {/* Paid Plans */}
          {Array.isArray(plans) &&
            plans.length > 0 &&
            [...plans]
              .filter((p) => p) // remove null/undefined entries safely
              .reverse()
              .map((plan: any, index: number) => {
                const name = plan?.name ?? "Unknown Plan";
                const amount = plan?.amount ?? 0;

                const planNameLower = plan?.name?.toLowerCase?.() ?? "";

                let highlight: { label: string; color: string } | null = null;
                if (planNameLower === "business") {
                  highlight = { label: "Best Value", color: "bg-green-500" };
                } else if (planNameLower === "standard") {
                  highlight = { label: "Most Popular", color: "bg-primary" };
                }

                return (
                  <RateCard
                    key={index}
                    title={name}
                    amount={amount}
                    defaultChecked={name === currentPlanName}
                    plan={plan?.plan_code ?? ""}
                    description={`Upgrade to ${name} for more visibility and advanced tools.`}
                    benefits={[
                      "Unlimited property listings",
                      "Priority search placement",
                      "Instant tenant match alerts",
                      "24/7 landlord support",
                    ]}
                    disabled={name === currentPlanName}
                    highlight={highlight}
                  />
                );
              })}
        </div>
      </div>
    </>
  );
}

function RateCard({
  title,
  amount,
  defaultChecked,
  plan,
  description,
  benefits,
  disabled,
  highlight,
}: {
  title: string;
  amount: number;
  defaultChecked?: boolean;
  plan: string;
  description: string;
  benefits: string[];
  disabled?: boolean;
  highlight?: { label: string; color: string } | null;
}) {
  const { setAlert } = useAlert();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubscription = async () => {
    if (disabled || loading) return;

    setLoading(true);
    try {
      const { data, success, message } = await initSubTransaction({
        plan,
        amount,
      });

      if (!success) throw new Error(message);
      router.push(data?.authorization_url ?? "/");
    } catch (err: any) {
      setAlert(err?.message ?? "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {highlight && (
        <div
          className={`absolute -top-3 right-3 text-[10px] font-bold text-white px-3 py-1 rounded-full ${highlight.color}`}
        >
          {highlight.label}
        </div>
      )}

      <input
        type="radio"
        id={title}
        defaultChecked={defaultChecked}
        name="plan"
        value={title}
        className="hidden peer"
      />

      <label
        htmlFor={title}
        className={`rounded-md px-4 py-6 border group flex w-full flex-col gap-5 cursor-pointer transition-all hover:shadow-md ${
          defaultChecked ? "peer-checked:bg-primary peer-checked:text-white" : ""
        }`}
      >
        {/* Title & Description */}
        <div className="w-full flex flex-col items-center gap-2">
          <h1 className="text-xl font-medium capitalize">{title}</h1>
          <p className="text-[11px] text-center font-medium">{description}</p>
        </div>

        {/* Price */}
        <div className="w-full flex flex-col items-center gap-2 border-b pb-3">
          <h1 className="text-3xl font-medium">
            {amount > 0 ? formatShortNaira(amount / 100) : "Free"}
          </h1>
          <p className="text-[11px] text-center font-medium">
            {amount > 0 ? "Per month" : "No monthly fee"}
          </p>
        </div>

        {/* Benefits */}
        <ul className="py-3 flex flex-col gap-2">
          {benefits.map((benefit, idx) => (
            <li key={idx} className="flex items-center gap-1 text-[11px] font-medium">
              <Checkbox checked disabled className="rounded-full border-2 border-primary" />
              {benefit}
            </li>
          ))}
        </ul>

        <Button
          onClick={handleSubscription}
          loading={loading}
          variant="outline"
          className="capitalize text-gray-700 text-xs font-medium h-11 rounded-lg"
          disabled={disabled || loading}
        >
          {loading ? "Processing..." : disabled ? "Current Plan" : "Choose Plan"}
        </Button>
      </label>
    </div>
  );
}

function formatShortNaira(value: number) {
  const val = currency(value).value;
  if (val >= 1_000_000) return `₦${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 1_000) return `₦${(val / 1_000).toFixed(0)}k`;
  return `₦${val}`;
}
