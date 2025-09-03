import mongoose from "mongoose";

const emailLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: "Property", default: null },
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: "Agent", default: null },
  recipientEmail: { type: String, required: true },
  subject: { type: String, required: true },
  bodyHtml: { type: String },
  bodyText: { type: String },
  status: { type: String, enum: ["sent", "failed", "queued"], default: "queued" },
  errorMessage: { type: String, default: null },
  emailProvider: { type: String, default: "Zoho" },
  templateId: { type: String, default: null },
  sentAt: { type: Date, default: null },
}, { timestamps: true });

export default mongoose.models.EmailLog || mongoose.model("EmailLog", emailLogSchema);
