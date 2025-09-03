"use server"

import { errorMessage } from "@/constants";
import { professionalDetailKeys, ProfessionalDetailType } from "@/sections/dashboard/formSchemas";
import { extractAllowedKeys } from "@/utils/extractAllowedKeys";
import { getCurrentUser } from "./auth";
import ProfessionalDetail from "@/server/schema/ProfessionalDetail";
import { revalidatePath } from "next/cache";
import Routes from "@/Routes";


export async function updateProfessionalDetail(payload: Partial<ProfessionalDetailType>) {
  try {
    const { data: user, message, success } = await getCurrentUser();
    if (!success || !user) {
      throw new Error(message || 'Authentication required');
    }

    const getKeys = await extractAllowedKeys<ProfessionalDetailType>(payload, professionalDetailKeys);
    if (!getKeys.success && getKeys.message) throw new Error(getKeys.message)
    const data = getKeys.data
    const newData = {...data, userId: user.id};

    const updated = await ProfessionalDetail.findOneAndUpdate(
      { userId: user.id },
      { $set: newData },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    ).lean();

    revalidatePath(Routes.dashboard["professional tools"]["professional details"]);

    return { success: true, message: null, data: updated };
  } catch (err: any) {
    return errorMessage(err.message);
  }
}

export async function getProfessionalDetail() {
      try {
        const { data: user, message, success } = await getCurrentUser();
        if (!success && message) throw new Error(message);
        // 
        const professionalDetails = await ProfessionalDetail.findOne({userId: user.id})
    
        return { success: true, message: null, data: professionalDetails };
      } catch (err: any) {
        return errorMessage(err.message);
      }
  }