"use client";

import { useState } from "react";
import { cancelSubscription } from "@/actions/subscription";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import useAlert from "@/hooks/useAlert";
dayjs.extend(advancedFormat);


export default function CancelSubscription ({ subscription, setOpen }: {subscription: any, setOpen: any}) {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const {setAlert} = useAlert()

  const handleCancel = async () => {
    try {
      setLoading(true)
      setError("");
      const res = await cancelSubscription();
      if (!res.success) throw new Error(res.message)
      setAlert("Subscription cancelled successfully.", 'success')
      return setOpen(false);
    }
    catch(err: any) {
      setError(err.message)
      return setAlert(err.message, 'error')
    }
    finally {
      setLoading(false)
    }
  };

  if (!subscription) return null;


  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="text-[11px] px-1 w-fit font-semibold text-primary">Cancel current plan</button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
        <div className="bg-gray-50 p-4 rounded-lg flex flex-col">
          <div className="w-full flex items-center justify-between gap-4 border-b border-b-muted py-3">
            <p className="text-xs font-medium capitalize">Plan</p>
            <p className="text-xs font-medium capitalize text-muted-foreground">{subscription.plan.name}</p>
          </div>

          <div className="w-full flex items-center justify-between gap-4 border-b border-b-muted py-3">
            <p className="text-xs font-medium capitalize">Amount</p>
            <p className="text-xs font-medium capitalize text-muted-foreground">₦{(subscription.amount / 100).toLocaleString()}</p>
          </div>

          <div className="w-full flex items-center justify-between gap-4 border-b border-b-muted py-3">
            <p className="text-xs font-medium capitalize">Next Billing Date</p>
            <p className="text-xs font-medium capitalize text-muted-foreground">{dayjs(subscription.nextBillingDate).format("MMMM Do, YYYY")}</p>
          </div>

          <div className="w-full flex items-center justify-between gap-4 pt-3">
            <p className="text-xs font-medium capitalize">Status</p>
            <p className="text-xs font-medium capitalize text-muted-foreground">{subscription.status}</p>
          </div>
        </div>

        {error && <p className="text-red-600 text-xs mb-3">{error}</p>}

        <p className="text-xs text-gray-700 my-4">
          Are you sure you want to cancel your subscription? This action cannot be undone, and you’ll lose access to premium features after{" "}
          <strong>{dayjs(subscription.expiresAt).format("MMMM Do, YYYY")}</strong>.
        </p>
        </AlertDialogHeader>


        <AlertDialogFooter>
          <AlertDialogCancel 
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Keep Subscription
          </AlertDialogCancel>

          <Button
            onClick={handleCancel}
            disabled={loading}
          >
            {loading ? "Cancelling..." : "Cancel Subscription"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
