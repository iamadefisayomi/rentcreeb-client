// app/actions/socials.ts
"use server";

import { errorMessage } from "@/constants";
import { socialAllowedKeys, SocialsType } from "@/sections/dashboard/formSchemas";
import { extractAllowedKeys } from "@/utils/extractAllowedKeys";
import Social from "@/server/schema/Social";
import { getCurrentUser } from "./auth";

export async function updateSocial(payload: SocialsType) {
  try {
    const { data: user, message, success } = await getCurrentUser();
    if (!success && message) throw new Error(message);

    const userId = user.id;

    const getKeys = await extractAllowedKeys<SocialsType>(payload, socialAllowedKeys);
    if (!getKeys.success && getKeys.message) throw new Error(getKeys.message)
    const data = getKeys.data

    const existing = await Social.findOne({ userId });

    if (existing) {
      await Social.updateOne({ userId }, data);
    } else {
      await Social.create({ userId, ...data });
    }

    return { success: true, message: null, data: null };
  } catch (err: any) {
    return errorMessage(err.message);
  }
}


export async function getSocial() {
  try {
    const { data: user, message, success } = await getCurrentUser();
    if (!success && message) throw new Error(message);

    const social = await Social.findOne({ userId: user.id }).lean();

    return { success: true, message: null, data: social };
  } catch (err: any) {
    return errorMessage(err.message);
  }
}