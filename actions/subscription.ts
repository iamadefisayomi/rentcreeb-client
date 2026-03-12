"use server";

import { errorMessage, NEXT_PUBLIC_BASE_URL } from "@/constants";
import { getCurrentUser } from "./auth";
import { paystackAxios } from "@/utils/paystackAxios";
import { revalidatePath } from "next/cache";
import Routes from "@/Routes";
import { dbConnection } from "@/lib/dbConnection";
import Inspection from "@/server/schema/Inspections";
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
        callback_url: `${NEXT_PUBLIC_BASE_URL}/api/paystack`,
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


const INSPECTION_FEE = 20000; // ₦20,000 per inspection

// Initialize inspection payment transaction
export async function payForInspection(propertyId: string) {
  try {
    const { data: user, success, message } = await getCurrentUser();
    if (!success) throw new Error(message);

    if (!propertyId) throw new Error("Invalid property ID");

    const payload = {
      email: user.email,
      amount: INSPECTION_FEE * 100, // Paystack expects amount in kobo
      callback_url: `${NEXT_PUBLIC_BASE_URL}/api/paystack/inspection?propertyId=${propertyId}`,
    };

    const initTransaction = (await paystackAxios.post("/transaction/initialize", payload)).data;
    if (!initTransaction.status) throw new Error(initTransaction.message);

    return {
      success: true,
      data: initTransaction.data, // contains reference, authorization_url, etc.
      message: "",
    };
  } catch (err: any) {
    return errorMessage(err.message);
  }
}

// Verify inspection payment
export async function verifyInspectionPayment(reference: string, propertyId: string) {
  try {
    if (!reference || !propertyId) throw new Error("Invalid request parameters");

    const { data: user, success, message } = await getCurrentUser();
    if (!success) throw new Error(message);

    const verifyResponse = (await paystackAxios.get(`/transaction/verify/${reference}`)).data;
    if (!verifyResponse.status) throw new Error(verifyResponse.message);

    const tx = verifyResponse.data;
    if (tx.status !== "success") throw new Error("Transaction not successful");
    if (tx.customer.email !== user.email) throw new Error("Invalid transaction");

    return {
      success: true,
      data: {
        reference,
        amount: tx.amount / 100,
        currency: "₦",
        paid_at: tx.paid_at,
        email: tx.customer.email,
        propertyId,
      },
      message: "",
    };
  } catch (err: any) {
    return errorMessage(err.message);
  }
}

export async function initInspectionPayment({ propertyId, renterEmail, inspectionDate, message: renterMessage, inspectionTime }: { propertyId: string; renterEmail: string, message: string, inspectionDate: string, inspectionTime: string }) {
  try {
    const { data: user, success, message } = await getCurrentUser();
    if (!success || !user) throw new Error(message);

    const payload = {
      email: renterEmail,
      amount: 2000000,
      callback_url: `${NEXT_PUBLIC_BASE_URL}/api/paystack/inspection/verify?propertyId=${propertyId}&message=${renterMessage}&date=${inspectionDate}&time=${inspectionTime}`
    };

    const initTransaction = (await paystackAxios.post('/transaction/initialize', payload)).data;

    if (!initTransaction.status) throw new Error(initTransaction.message);

    return { success: true, data: initTransaction.data, message: "" };
  } catch (err: any) {
    return { success: false, message: err.message, data: null };
  }
}

export async function validateInspectionSuccess(reference: string) {
  await dbConnection();

  const inspection = await Inspection.findOne({ reference });

  if (!inspection) {
    return { success: false };
  }

  if (inspection.viewed) {
    return { success: false };
  }

  // mark as viewed immediately
  inspection.viewed = true;
  await inspection.save();

  return { success: true };
}