// /server/schema/Waitlist.ts

import mongoose, { Schema, model, models } from "mongoose";

const WaitlistSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
      type: String,
      trim: true,
    },

    lga: {
      type: String,
      trim: true,
    },

    city: {
      type: String,
      trim: true,
    },

    interest: {
      type: String,
      trim: true,
      default: "",
    },

    iAm: {
      type: String,
      trim: true,
      default: "",
    },

    message: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "pending",
        "invited",
        "registered",
        "declined",
      ],
      default: "pending",
    },

    source: {
      type: String,
      default: "website",
    },

    invitedAt: Date,

    registeredAt: Date,

    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    collection: "waitlist",
  }
);

const Waitlist =
  models.Waitlist || model("Waitlist", WaitlistSchema);

export default Waitlist;