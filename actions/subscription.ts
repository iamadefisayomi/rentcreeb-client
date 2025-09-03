"use server";

import { errorMessage } from "@/constants";
import { getCurrentUser } from "./auth";
import { paystackAxios } from "@/utils/paystackAxios";
import { revalidatePath } from "next/cache";
import Routes from "@/Routes";


// Get current user subscription package
export async function getCurrentUserSubscription () {
    try {
        const { data: user, message, success } = await getCurrentUser();
        if (!success) throw new Error(message);
        // 
        const subscriptions = await (await paystackAxios.get(`/subscription`)).data
        if (!subscriptions.status) throw new Error(subscriptions.message)
        // 
        const currentUserSubscription = subscriptions.data
            ?.find((res: any) => res.customer?.email === user.email)
        
        return ({
            success: true,
            data: currentUserSubscription,
            message: ''
        })
    }
    catch(err: any) {
        return errorMessage(err.message)
    }
}

// initialize subscription transaction
export async function initSubTransaction ({plan, amount}: {plan: string, amount: number}) {
    try {
        const { data: user, message, success } = await getCurrentUser();
        if (!success) throw new Error(message);
        // 
        const userSub = await getCurrentUserSubscription()
        if (!userSub.success) throw new Error(userSub.message)

        // if there is an active subscription 
        if (userSub.data && userSub.data?.status === 'active') {
            const interval = userSub.data.plan.interval
            const subName = userSub.data.plan.name
            throw new Error(`Your ${subName} ${interval} subscription is still active. Cancel subscription to continue`)
        }
        // 
        // 2. Initialize Paystack transaction
        const payload = {
        plan,
        email: user.email,
        amount,
        callback_url: "http://localhost:3000/api/paystack",
        };
        const initTransaction = (
        await paystackAxios.post(`/transaction/initialize`, payload)
        ).data;
        if (!initTransaction.status) throw new Error(initTransaction.message);

        return {
            success: true,
            message: "",
            data: initTransaction.data,
        }
    }
    catch(err: any) {
        return errorMessage(err.message)
    }
}


// Verify subscription transaction
export async function verifySubTransaction (reference: string) {
    try {
        if (!reference || typeof reference !== "string")throw new Error("Invalid transaction.");
        // 
        const { data: user, message, success } = await getCurrentUser();
        if (!success) throw new Error(message);
        // 
        // Verify with Paystack
        const verifyResponse = (
            await paystackAxios.get(`/transaction/verify/${reference}`)
        ).data;
        if (!verifyResponse.status) throw new Error(verifyResponse.message);
    
        const tx = verifyResponse.data;
        if (tx.status !== "success") throw new Error("Transaction not successful.");
        if (tx.customer.email !== user.email) throw new Error("Invalid transaction.");

        revalidatePath(Routes.dashboard["professional tools"]["my plan"]);

        return ({
            success: true,
            data: {
                reference,
                name: tx.plan_object.name,
                amount: tx.plan_object.amount,
                currency: "₦",
                paid_at: tx.paid_at,
                email: tx.customer.email
            },
            message: ''
        })
    }
    catch(err: any) {
        return errorMessage(err.message)
    }
}

// cancel user subscription
export async function cancelSubscription() {
  try {
    const { data: user, success, message } = await getCurrentUser();
    if (!success) throw new Error(message);

    // 
    const userSub = await getCurrentUserSubscription()
    if (!userSub.success) throw new Error(userSub.message)

    // if there is an active subscription 
    if (!userSub.data || userSub.data?.status !== 'active') throw new Error('You do not have an active subscription.')
    // 
    else if (userSub.data || userSub.data?.status === 'active') {
        const code = userSub.data?.subscription_code
        const token = userSub.data?.email_token
        const res = (
        await paystackAxios.post("/subscription/disable", { code, token })
        ).data;

        if (!res.status) throw new Error(res.message);
    }

    revalidatePath(Routes.dashboard["professional tools"]["my plan"]);

    return {
      success: true,
      message: "Subscription disabled successfully.",
    };
  } catch (err: any) {
    return errorMessage(err.message);
  }
}
