"use client";

import { Button } from "@/components/ui/button";
import React, { useEffect, useRef, useState } from "react";

const PhotoCapture: React.FC<{ query: any; setQuery: any }> = ({
  query,
  setQuery,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [status, setStatus] = useState("Initializing camera...");
  const [cameraActive, setCameraActive] = useState(false);

  const startCamera = async () => {
    try {
      // Stop existing stream first (important when restarting)
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" }, 
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      setCameraActive(true);
      setStatus("Camera ready. Align your face within the frame.");
    } catch (error) {
      console.error("Camera access error:", error);
      setStatus("Unable to access camera.");
    }
  };

  useEffect(() => {
    startCamera();

    // Cleanup on unmount
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL("image/png");
    setQuery({ ...query, photo: imageData });

    setCameraActive(false);
    setStatus("Photo captured successfully.");
  };

  const retakePhoto = () => {
    setQuery({ ...query, photo: null });
    setStatus("Reinitializing camera...");
    startCamera();
  };

  return (
    <div className="w-full mx-auto flex flex-col items-center gap-6 justify-center">
      <div className="text-start text-[11px] uppercase w-full max-w-lg font-medium text-gray-500">
        Status: {status}
      </div>

      {query.photo ? (
        <img
          src={query.photo}
          alt="Captured for NIN Verification"
          className="w-full max-w-lg rounded-lg shadow"
        />
      ) : (
        cameraActive && (
          <div className="relative w-full max-w-lg">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full rounded-xl"
            />
            {/* Face Overlay */}
            <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center pointer-events-none">
              <div className="border-4 border-blue-500 rounded-full w-72 h-72 opacity-50" />
            </div>
          </div>
        )
      )}

      <canvas ref={canvasRef} style={{ display: "none" }} />

      <div className="text-xs text-muted-foreground max-w-lg text-center">
        Please ensure your face is clearly visible and well-lit.
      </div>

      {
        query.photo ? (
          <div className="w-full grid grid-cols-2 gap-3">
            <Button
              variant="destructive"
              onClick={retakePhoto}
            >
              Retake Photo
            </Button>
            <Button
              onClick={() => null}
            >
              Continue
            </Button>
          </div>
        ) : (
            <Button
              className="w-full"
              variant="outline"
              onClick={capturePhoto}
            >
              Capture Photo
            </Button>
        )
      }
    </div>
  );
};

export default PhotoCapture;
