"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { Trash2, ImagePlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useAlert from "@/hooks/useAlert";
import { getMultipleImages } from "@/hooks/useGetImage";
import Image from "next/image";

interface ImageUploaderProps {
  setImages: (files: (File | string)[]) => void;
  images: (File | string)[];
  maxFiles?: number;
  maxSizeMB?: number;
}

const NewPropImagesUploader: React.FC<ImageUploaderProps> = ({
  setImages,
  images,
  maxFiles = 10,
  maxSizeMB = 10,
}) => {
  const { setAlert } = useAlert();
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Clean up object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      images.forEach((img) => {
        if (img instanceof File) {
          URL.revokeObjectURL(URL.createObjectURL(img)); // safe even if already revoked
        }
      });
    };
  }, [images]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const total = images.length + acceptedFiles.length;
      if (total > maxFiles) {
        setAlert(`Maximum ${maxFiles} images allowed`, "error");
        return;
      }

      const tooLarge = acceptedFiles.filter((f) => f.size > maxSizeMB * 1024 * 1024);
      if (tooLarge.length > 0) {
        setAlert(`Files exceed ${maxSizeMB}MB limit`, "error");
        return;
      }

      // Append new files
      setImages([...images, ...acceptedFiles]);
    },
    [images, setImages, maxFiles, maxSizeMB, setAlert]
  );

  const handleGetImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const total = images.length + files.length;
    if (total > maxFiles) {
      setAlert(`Maximum ${maxFiles} images allowed`, "error");
      e.target.value = ""; // clear input
      return;
    }

    try {
      const { data, success, message } = await getMultipleImages(e);
      if (!success || !data) {
        setAlert(message || "Failed to process images", "error");
        return;
      }

      setImages([...images, ...data]);
    } catch (error) {
      console.error("Image processing error:", error);
      setAlert("Something went wrong while adding images", "error");
    } finally {
      e.target.value = ""; // reset input so same files can be selected again if needed
    }
  };

  const removeImage = useCallback(
    (index: number) => {
      setImages(images.filter((_, i) => i !== index));
    },
    [images, setImages]
  );

  const handleDragStart = (index: number) => setDraggedIndex(index);
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

  const handleDropReorder = useCallback(
    (index: number) => {
      if (draggedIndex === null || draggedIndex === index) return;

      const newImages = [...images];
      const [draggedItem] = newImages.splice(draggedIndex, 1);
      newImages.splice(index, 0, draggedItem);

      setImages(newImages);
      setDraggedIndex(null);
    },
    [draggedIndex, images, setImages]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: true,
    noClick: false, // allow click to open file dialog (but we override with custom label)
    noKeyboard: true,
  });

  const previews = useMemo(
    () =>
      images.map((image) => ({
        src: typeof image === "string" ? image : URL.createObjectURL(image),
        key: typeof image === "string" ? image : `${image.name}-${image.lastModified}`,
      })),
    [images]
  );

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`w-full p-6 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-3 cursor-pointer transition
          ${isDragActive ? "border-primary bg-primary/10" : "border-gray-300 bg-slate-50 hover:bg-slate-100"}`}
      >
        <input {...getInputProps()} /> {/* ← Crucial: this attaches the real hidden input & events */}

        <ImagePlus className="w-12 h-12 text-primary" />
        <label
          htmlFor="customFileInput" // different ID to avoid conflict
          className="bg-blue-600 text-white py-2 px-6 rounded-md cursor-pointer hover:bg-blue-700 transition text-sm font-medium"
          onClick={(e) => e.stopPropagation()} // prevent dropzone from handling click here
        >
          Select Photos
          <input
            type="file"
            multiple
            accept="image/*"
            id="customFileInput"
            className="hidden"
            onChange={handleGetImages}
          />
        </label>
        <p className="text-gray-500 text-xs">
          {isDragActive ? "Drop images here..." : "or drag & drop photos here"}
        </p>
      </div>

      {/* Previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          <AnimatePresence mode="popLayout">
            {previews.map(({ src, key }, index) => (
              <motion.div
                key={key}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.25 }}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={handleDragOver}
                onDrop={() => handleDropReorder(index)}
                className="relative group aspect-square rounded-lg overflow-hidden shadow-sm cursor-grab active:cursor-grabbing bg-gray-100"
              >
                <Image
                  src={src}
                  alt={`Image ${index + 1}`}
                  fill
                  className="object-cover transition group-hover:scale-105"
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 z-10 bg-white/90 backdrop-blur-sm text-gray-800 rounded-full w-7 h-7 flex items-center justify-center shadow hover:bg-red-500 hover:text-white opacity-0 group-hover:opacity-100 transition"
                  aria-label="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default NewPropImagesUploader;