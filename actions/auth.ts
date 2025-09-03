"use server"


import { errorMessage } from "@/constants";
import { auth } from "@/auth";
import { headers } from "next/headers";


export async function getCurrentUser () {
  try {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    return ({
      success: true,
      data: session?.user,
      message: ''
    })
  }
  catch(err: any) {
    return errorMessage(err.message)
  }
}

// 
const requiredField =  ["name", "email", "image", "phone", "emailVerified", "gender", "whatsapp", "username", "role"]
export async function getUserTrustScore () {
  try {
    const {success, message, data: user} = await getCurrentUser()
    if (!success && message) throw new Error(message)
    // 
    // 🚦 Count filled fields
    let filled = 0;
    let total = 0;

    // ✅ Check core fields from client session
    for (const field of requiredField) {
      total++;
      const val = (user as any)[field];
      if (field === "emailVerified") {
        if (val === true) filled++;
      } else if (val != null && val !== "") {
        filled++;
      }
    }

    const score = Math.round((filled / total) * 100);

    return {
      success: true,
      data: {score},
      message: null,
    };
  } catch (err: any) {
    return errorMessage(err.message);
  }
}
