import mongoose, { Schema, Document } from "mongoose";

interface ISignal extends Document {
  senderId: string;
  receiverId: string;
  signal: any;
}

const SignalSchema = new Schema<ISignal>(
  {
    senderId: { type: String, required: true },
    receiverId: { type: String, required: true },
    signal: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

const Signal = mongoose.models.Signal ||
  mongoose.model<ISignal>("Signal", SignalSchema);

  export default Signal