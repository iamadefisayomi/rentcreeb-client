"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Trash2, ImagePlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useAlert from "@/hooks/useAlert";
import { getMultipleImages } from "@/hooks/useGetImage";
import Image from "next/image";

interface ImageUploaderProps {
  setImages: (files: (File | string)[]) => void;
  images: (File | string)[];
}

const NewPropImagesUploader: React.FC<ImageUploaderProps> = ({ setImages, images }) => {
  const { setAlert } = useAlert();
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setImages([...images, ...acceptedFiles]);
    },
    [setImages, images]
  );

  const handleGetImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const { data, success, message } = await getMultipleImages(e);
      if (!success || !data) {
        return setAlert(message || "Failed to upload images", "error");
      }
      setImages([...images, ...data]);
    } catch (error) {
      console.error("Error fetching images:", error);
      setAlert("Something went wrong while uploading images", "error");
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...images];
    const [draggedItem] = newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedItem);

    setImages(newImages);
    setDraggedIndex(null);
  };

  const { getRootProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: true,
  });

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Dropzone Area */}
      <div
        {...getRootProps()}
        className="w-full p-6 border-dashed bg-slate-50 flex items-center gap-2 flex-col justify-center border-2 border-primary h-48 rounded-lg cursor-pointer"
      >
        <ImagePlus className="w-10 h-10 text-primary" />
        <label
          htmlFor="fileInput"
          className="block capitalize text-xs bg-blue-600 text-white py-2 px-4 text-center rounded-md cursor-pointer hover:bg-blue-700"
        >
          Select Photos
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            id="fileInput"
            onChange={handleGetImages}
          />
        </label>
        <p className="text-gray-600 text-[11px]">or drag photos here</p>
      </div>

      {/* Image Preview */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 w-full md:max-w-[85%] mx-auto">
          <AnimatePresence>
            {images.map((image, index) => {
              const imageUrl = typeof image === "string" ? image : URL.createObjectURL(image);
              return (
                <motion.div
                  key={typeof image === "string" ? image : image.name}
                  draggable={true}
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(index)}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className="relative group cursor-grab active:cursor-grabbing"
                >
                  <Image
                      src={imageUrl}
                      alt={`Image ${index + 1}`}
                      width={300}
                      height={300}
                      className={`w-full h-24 object-cover rounded-md transition-opacity duration-300 ${
                        loading ? "opacity-70" : "opacity-100"
                      }`}
                      loading="lazy"
                      unoptimized
                      onLoad={() => setLoading(false)}
                    />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 w-6 h-6 p-1 flex items-center justify-center bg-white text-black rounded-full hover:bg-red-500 hover:text-white transition"
                  >
                    <Trash2 className="w-4" />
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default NewPropImagesUploader;
