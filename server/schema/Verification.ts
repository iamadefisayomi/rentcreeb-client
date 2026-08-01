import { Schema, model, models, Types } from "mongoose";

export interface VerificationDocument {
  userId: Types.ObjectId;
  nin: string;
  image: string; // base64 or URL
  status: "pending" | "verified" | "failed";
  premResult?: any; // Prembly response
  createdAt: Date;
  updatedAt: Date;
}

const VerificationSchema = new Schema<VerificationDocument>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    nin: { type: String, required: true },
    image: { type: String, required: true },
    status: { type: String, enum: ["pending", "verified", "failed"], default: "pending" },
    premResult: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export const Verification = models.Verification || model<VerificationDocument>("Verification", VerificationSchema);