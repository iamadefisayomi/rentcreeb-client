"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";

type Challenge = "blink" | "left" | "right" | "done";

interface AdvancedFaceCaptureProps {
  onCapture: (img: string) => void; // Now returns a single string
}

export default function AdvancedFaceCapture({ onCapture }: AdvancedFaceCaptureProps) {
  const webcamRef = useRef<Webcam>(null);
  const faceMeshRef = useRef<any>(null);
  const requestRef = useRef<number>(0);

  const [instruction, setInstruction] = useState("Align your face in the oval");
  const [faceDetected, setFaceDetected] = useState(false);
  const [status, setStatus] = useState<"loading" | "ready" | "success">("loading");
  const [currentChallenge, setCurrentChallenge] = useState<Challenge>("blink");

  const state = useRef({
    challenge: "blink" as Challenge,
    blinkCount: 0,
    isEyeClosed: false,
    baseNoseX: null as number | null,
    isProcessing: false,
    done: false,
    goldenFrame: null as string | null, // This will be the NIN-ready photo
  });

  const cleanup = useCallback(() => {
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    if (faceMeshRef.current) faceMeshRef.current.close();
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        const { FaceMesh } = await import("@mediapipe/face_mesh");
        const fm = new FaceMesh({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
        });

        fm.setOptions({
          maxNumFaces: 1,
          refineLandmarks: true,
          minDetectionConfidence: 0.6,
          minTrackingConfidence: 0.6,
        });

        fm.onResults(handleResults);
        faceMeshRef.current = fm;
        setStatus("ready");
        detect();
      } catch (err) {
        setInstruction("Failed to load face detection model");
      }
    };

    const detect = async () => {
      if (webcamRef.current?.video?.readyState === 4 && faceMeshRef.current && !state.current.isProcessing && !state.current.done) {
        state.current.isProcessing = true;
        try {
          await faceMeshRef.current.send({ image: webcamRef.current.video });
        } catch (e) { console.error(e); }
        state.current.isProcessing = false;
      }
      requestRef.current = requestAnimationFrame(detect);
    };

    init();
    return cleanup;
  }, [cleanup]);

  const handleResults = (res: any) => {
    if (state.current.done) return;

    if (!res.multiFaceLandmarks?.length) {
      setFaceDetected(false);
      setInstruction("Face not visible");
      return;
    }

    setFaceDetected(true);
    const lm = res.multiFaceLandmarks[0];
    const nose = lm[1];
    const leftEyeTop = lm[159];
    const leftEyeBottom = lm[145];
    const faceLeft = lm[234];
    const faceRight = lm[454];

    // 1. Position & Quality Checks
    const isCentered = nose.x > 0.35 && nose.x < 0.65 && nose.y > 0.3 && nose.y < 0.7;
    const faceWidth = Math.abs(faceRight.x - faceLeft.x);

    if (!isCentered) {
      setInstruction("Center your face in the oval");
      return;
    }

    if (faceWidth < 0.25) {
      setInstruction("Move closer to the camera");
      return;
    }

    // ⭐ CAPTURE GOLDEN FRAME: Capture the best frontal shot once centered
    // This happens once, before the user starts turning their head.
    if (!state.current.goldenFrame) {
      const shot = webcamRef.current?.getScreenshot();
      if (shot) state.current.goldenFrame = shot;
    }

    // 2. Baseline & Liveness logic
    if (state.current.baseNoseX === null) {
      state.current.baseNoseX = nose.x;
    }

    const horizontalShift = nose.x - state.current.baseNoseX!;

    switch (state.current.challenge) {
      case "blink":
        setInstruction("Blink your eyes naturally");
        const ear = Math.abs(leftEyeTop.y - leftEyeBottom.y);
        if (ear < 0.015) {
          state.current.isEyeClosed = true;
        } else if (ear > 0.025 && state.current.isEyeClosed) {
          state.current.blinkCount++;
          state.current.isEyeClosed = false;
          if (state.current.blinkCount >= 1) {
            state.current.challenge = "left";
            setCurrentChallenge("left");
            state.current.baseNoseX = nose.x;
          }
        }
        break;

      case "left":
        setInstruction("Slowly turn your head LEFT ⟵");
        if (horizontalShift < -0.06) {
          state.current.challenge = "right";
          setCurrentChallenge("right");
          state.current.baseNoseX = nose.x;
        }
        break;

      case "right":
        setInstruction("Now turn your head RIGHT ⟶");
        if (horizontalShift > 0.06) {
          completeLiveness();
        }
        break;
    }
  };

  const completeLiveness = () => {
    if (state.current.done) return;
    state.current.done = true;
    state.current.challenge = "done";
    setCurrentChallenge("done");

    // If for some reason goldenFrame wasn't caught, take one final shot
    const finalShot = state.current.goldenFrame || webcamRef.current?.getScreenshot();

    setStatus("success");
    setInstruction("✅ Verification Complete");
    
    if (finalShot) {
      onCapture(finalShot);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6 bg-white rounded-2xl shadow-xl border border-gray-100 max-w-sm mx-auto">
      <div className="relative w-full aspect-[3/4] overflow-hidden rounded-2xl bg-slate-900">
        {status === "loading" && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-900 text-white gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent" />
            <p className="text-xs">Loading AI...</p>
          </div>
        )}

        <Webcam
          ref={webcamRef}
          mirrored
          screenshotFormat="image/jpeg"
          videoConstraints={{ facingMode: "user", width: 480, height: 640 }}
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <div
            className={`transition-all duration-700 border-2 ${
              status === "success" ? "border-green-500 bg-green-500/10 shadow-[0_0_20px_rgba(34,197,94,0.4)]" : 
              faceDetected ? "border-blue-400" : "border-white/30"
            }`}
            style={{ width: "70%", height: "65%", borderRadius: "100% 100% 100% 100% / 120% 120% 80% 80%" }}
          />
        </div>
      </div>

      <div className="w-full text-center space-y-4">
        <h3 className={`text-lg font-semibold min-h-[3rem] ${status === "success" ? "text-green-600" : "text-slate-800"}`}>
          {instruction}
        </h3>
        
        <div className="flex justify-center gap-3">
          {(["blink", "left", "right"] as Challenge[]).map((step, idx) => {
             const isCompleted = status === "success" || (currentChallenge === "left" && idx === 0) || (currentChallenge === "right" && idx <= 1);
             return <div key={step} className={`h-1.5 w-10 rounded-full transition-all ${currentChallenge === step ? "bg-blue-500 w-14" : isCompleted ? "bg-green-500" : "bg-slate-200"}`} />;
          })}
        </div>
      </div>
    </div>
  );
}