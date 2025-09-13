"use server"


import mongoose, { Schema, Document, models } from "mongoose";

interface PageSize {
  label: string;
  width: number;
}

export interface ResumeSettingsDocument extends Document {
  resumeId: string;
  selectedFont: string;
  preview: boolean;
  pageSize: PageSize;
  resumeList: string[];
  docName: string;
  publishedSettings?: {
    selectedFont: string;
    pageSize: PageSize;
    resumeList: string[];
    docName: string;
  };
}

const PageSizeSchema = new Schema<PageSize>(
  {
    label: { type: String, required: true },
    width: { type: Number, required: true },
  },
  { _id: false }
);

const ResumeSettingsSchema = new Schema<ResumeSettingsDocument>(
  {
    resumeId: { type: String, required: true, unique: true },
    selectedFont: { type: String, default: "Poppins" },
    preview: { type: Boolean, default: false },
    pageSize: { type: PageSizeSchema, default: { label: "A4", width: 595 } },
    resumeList: { type: [String], default: [] },
    docName: { type: String, default: "" },
    publishedSettings: {
      selectedFont: { type: String, default: "Poppins" },
      pageSize: { type: PageSizeSchema, default: { label: "A4", width: 595 } },
      resumeList: { type: [String], default: [] },
      docName: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

const ResumeSettings =
  models.ResumeSettings ||
  mongoose.model<ResumeSettingsDocument>("ResumeSettings", ResumeSettingsSchema);

export default ResumeSettings;
