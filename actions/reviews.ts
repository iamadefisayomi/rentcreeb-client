"use server";

import { errorMessage } from "@/constants";
import { getCurrentUser } from "./auth";
import Review from "@/server/schema/Review";
import Property from "@/server/schema/Property";
import { revalidatePath } from "next/cache";
import { dbConnection } from "@/lib/dbConnection";


// GET REVIEWS
export async function getReviews(propertyId: string) {
  try {
    // Ensure property exists
    await dbConnection()
    const property = await Property.findById(propertyId);
    if (!property) throw new Error("Property not found");

    // Fetch reviews and populate user (optional: username, avatar, etc.)
    const reviews = await Review.find({ propertyId })
      .populate("userId", "name avatar email") // adjust fields depending on your User schema
      .sort({ createdAt: -1 }) // newest first
      .lean();

    return {
      success: true,
      message: null,
      data: reviews,
    };
  } catch (err: any) {
    return errorMessage(err.message);
  }
}

// ADD REVIEW
export async function addReview({
  propertyId,
  rating,
  message,
}: {
  propertyId: string;
  rating: number;
  message?: string;
}) {
  try {
    await dbConnection()
    const { data: user, message: userMessage, success } = await getCurrentUser();
    if (!success || !user) throw new Error(userMessage || "Authentication required");

    // Ensure property exists
    const property = await Property.findById(propertyId);
    if (!property) throw new Error("Property not found");

    const newReview = await Review.create({
      userId: user.id,
      propertyId,
      rating,
      message,
    });

    revalidatePath(`/property/${property.slug}`);

    return { success: true, message: "Review added successfully", data: newReview };
  } catch (err: any) {
    return errorMessage(err.message);
  }
}

// UPDATE REVIEW
export async function updateReview({
  reviewId,
  rating,
  message,
}: {
  reviewId: string;
  rating?: number;
  message?: string;
}) {
  try {
    await dbConnection()
    const { data: user, message, success } = await getCurrentUser();
    if (!success || !user) throw new Error(message || "Authentication required");

    const updated = await Review.findOneAndUpdate(
      { _id: reviewId, userId: user.id },
      { $set: { rating, message } },
      { new: true, runValidators: true }
    );

    if (!updated) throw new Error("Review not found or not authorized");

    revalidatePath(`/property/${updated.slug}`);

    return { success: true, message: "Review updated successfully", data: updated };
  } catch (err: any) {
    return errorMessage(err.message);
  }
}

// DELETE REVIEW
export async function deleteReview(reviewId: string) {
  try {
    await dbConnection()
    const { data: user, message, success } = await getCurrentUser();
    if (!success || !user) throw new Error(message || "Authentication required");

    const deleted = await Review.findOneAndDelete({ _id: reviewId, userId: user.id });
    if (!deleted) throw new Error("Review not found or not authorized");

    revalidatePath(`/property/${deleted.slug}`);

    return { success: true, message: "Review deleted successfully", data: deleted };
  } catch (err: any) {
    return errorMessage(err.message);
  }
}
