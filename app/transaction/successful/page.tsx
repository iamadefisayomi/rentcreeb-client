"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import Routes from "@/Routes";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useSearchParams } from "next/navigation";

export default function TransactionSuccessPage() {

  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const router = useRouter()
  const searchParams = useSearchParams();

  const reference = searchParams.get("reference");
  const name = searchParams.get("name");
  const amount = searchParams.get("amount");
  const email = searchParams.get("email");
  const currency = searchParams.get("currency");
  const paidAt = searchParams.get("paid_at");

  // Handle confetti sizing
  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    const handleResize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      {/* Confetti */}
      <Confetti width={windowSize.width} height={windowSize.height} />

      {/* Success Heading */}
      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-lg text-center flex flex-col items-center justify-between gap-5">
        <div className='flex flex-col gap-1 items-center justify-center w-full'>
            <h1 className="text-3xl font-bold text-green-600">Payment Successful 🎉</h1>
            <p className="text-gray-600 text-sm">Thank you for your purchase!</p>
        </div>

        {/* Receipt Card */}
        <div className="border-t pt-4 text-left text-xs font-medium space-y-2 w-full">
          <div className="flex justify-between">
            <span className="font-medium">Reference:</span>
            <span className="text-muted-foreground">{reference}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Plan:</span>
            <span className="text-muted-foreground">{name}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Amount:</span>
            <span className="text-muted-foreground">
            {currency}
            {amount ? (Number(amount) / 100).toLocaleString(undefined, { minimumFractionDigits: 2 }) : "0.00"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Date:</span>
            <span className="text-muted-foreground">{paidAt}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Email:</span>
            <span className="text-muted-foreground">{email}</span>
          </div>
        </div>

        {/* Button */}
        <Button
          onClick={() => router.replace(Routes.dashboard["professional tools"]["my plan"])}
          className="bg-green-500 hover:bg-green-400 active:bg-green-500"
        >
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
}
