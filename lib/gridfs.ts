import mongoose from "mongoose";
import { GridFSBucket } from "mongodb";

let bucket: GridFSBucket | null = null;

export async function getGridFSBucket(): Promise<GridFSBucket> {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGODB_URI!);
  }

  const db = mongoose.connection.db;
  if (!db) throw new Error("MongoDB connection not ready");

  if (!bucket) {
    bucket = new GridFSBucket(db, { bucketName: "images" });
  }

  return bucket;
}
