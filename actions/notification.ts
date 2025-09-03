"use server";

import { errorMessage, notificationKey } from "@/constants";
import { NotificationType } from "@/sections/dashboard/formSchemas";
import { extractAllowedKeys } from "@/utils/extractAllowedKeys";
import { getCurrentUser } from "./auth";


export async function updateNotifications(payload: NotificationType) {
  try {
    // const { data: user, message, success } = await getCurrentUser();
    // if (!success && message) throw new Error(message);

    // const userRef = adminDB.collection(notificationKey).doc(user.uid);

    // // Extract only allowed fields
    // const data = extractAllowedKeys<NotificationType>(payload, ["getAccountUpdate", "getBookmarkNotification", 'getClientEmail', 'getCommentNotification', 'getExpiryNotification', 'getInspirations', 'getInquiryNotification', 'getInsiderNews', 'getListingUpdates', 'getMarketInsight', 'getMeetupNews', 'getMentionNotification', 'getScheduleNotification', 'getOpportunity', 'getNews']);

    // // Check if the document exists
    // const doc = await userRef.get();

    // if (doc.exists) {
    //   // If the document exists, update it
    //   await userRef.update(data);
    // } else {
    //   // If the document doesn't exist, create it with merge
    //   await userRef.set({ ...data, createdAt: new Date() }, { merge: true });
    // }

    return { success: true, message: null, data: null };
  } catch (err: any) {
    return errorMessage(err.message);
  }
}

/**
 * Fetches the user's social links from Firestore.
 */
export async function getNotifications() {
  try {
    // const { data: user, message, success } = await getCurrentUser();
    // if (!success && message) throw new Error(message);

    // const userRef = adminDB.collection(notificationKey).doc(user.uid);
    // const doc = await userRef.get();

    // if (!doc.exists) {
    //   return { success: false, message: "No data found", data: null };
    // }

    // // Convert Firestore Timestamps to JSON-friendly format
    // const res = doc.data();
    // if (res?.createdAt) {
    //     res.createdAt = res.createdAt.toDate().toISOString(); // Convert Firestore Timestamp to string
    // }

    return { success: true, message: null, data: null };
  } catch (err: any) {
    return errorMessage(err.message);
  }
}