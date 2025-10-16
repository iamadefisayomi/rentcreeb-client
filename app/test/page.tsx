"use client";

import { uploadSingleImage } from "@/actions/imagekit";
import { useState } from "react";

export default function NigeriaLocationSearch() {
  const [uploading, setUploading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // ✅ get first file
    if (!file) return;

    setUploading(true);
    try {
      const res = await uploadSingleImage(file);
      console.log("Upload result:", res);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-sm flex flex-col gap-2">
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="border p-2 rounded"
      />
      {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
      <p>Hello test</p>
    </div>
  );
}
