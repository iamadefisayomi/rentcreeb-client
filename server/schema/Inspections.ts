// server/schema/Inspection.ts
import { Schema, Types, model, models } from 'mongoose';
import crypto from 'crypto';

export interface InspectionDocument {
  _id: Types.ObjectId;
  propertyId: Types.ObjectId;
  userId: Types.ObjectId; // renter
  agentId: Types.ObjectId; // property agent
  reference: string; // payment reference
  amount: number; // amount paid
  currency: string; // currency symbol
  paidAt: Date; // timestamp of payment
  inspectionDate: string; // renter selected date
  inspectionTime: string; // renter selected time
  message: string; // optional renter message
  verificationCode: string; // 6-character code for verification
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  viewed: boolean;
}

const InspectionSchema = new Schema<InspectionDocument>(
  {
    propertyId: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    agentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reference: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true, default: '₦' },
    paidAt: { type: Date, required: true },
    inspectionDate: { type: String, required: true }, // YYYY-MM-DD
    inspectionTime: { type: String, required: true }, // HH:mm
    message: { type: String, trim: true, default: '' },
    verificationCode: { type: String, required: true, unique: true },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
    viewed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Indexes for quick lookup
InspectionSchema.index({ propertyId: 1 });
InspectionSchema.index({ userId: 1, propertyId: 1 });

// Pre-save hook to generate 6-character verification code
InspectionSchema.pre('validate', function (next) {
  if (!this.verificationCode) {
    // Generate random 6-character alphanumeric code
    this.verificationCode = crypto.randomBytes(3).toString('hex').toUpperCase();
  }
  next();
});

const Inspection = models.Inspection || model<InspectionDocument>('Inspection', InspectionSchema);
export default Inspection;