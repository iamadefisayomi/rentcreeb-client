import mongoose, { Schema, Document } from "mongoose";

export interface IImage extends Document {
  filename: string;
  contentType: string;
  imageBase64: string;
  hash: string;
}

const ImageSchema = new Schema<IImage>(
  {
    filename: { type: String, required: true },
    contentType: { type: String, required: true },
    imageBase64: { type: String, required: true },
    hash: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export default mongoose.models.Image || mongoose.model<IImage>("Image", ImageSchema);
