// models/UserSocial.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUserSocial extends Document {
  userId: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSocialSchema: Schema<IUserSocial> = new Schema(
  {
    userId: { type: String, required: true, unique: true },
    facebook: { type: String, default: "" },
    instagram: { type: String, default: "" },
    twitter: { type: String, default: "" },
    linkedin: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

const Social: Model<IUserSocial> = mongoose.models.Social || mongoose.model<IUserSocial>("Social", UserSocialSchema);

export default Social;
