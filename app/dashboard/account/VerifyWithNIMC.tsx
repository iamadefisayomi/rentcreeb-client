"use client";

import AdvancedFaceCapture from "@/components/AdvancedFaceCapture";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useAlert from "@/hooks/useAlert";
import { ChevronLeft, IdCard } from "lucide-react";
import { useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { REGEXP_ONLY_DIGITS } from "input-otp"


export default function VerifyWithNIMC() {
  const [step, setStep] = useState<"intro" | "nin" | "capture" | "result">("intro");
  const [open, setOpen] = useState(false);

  return (
    <Dialog onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Verify Now</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[420px] overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-sm font-medium">
            {step !== "intro" && (
              <Button
                size="icon"
                variant="outline"
                onClick={() =>
                  setStep(step === "capture" ? "nin" : "intro")
                }
              >
                <ChevronLeft className="w-4" />
              </Button>
            )}

            {step === "intro" && "Verify your identity"}
            {step === "nin" && "NIN Verification"}
            {step === "capture" && "Face Capture"}
            {step === "result" && "Verification Result"}
          </DialogTitle>
        </DialogHeader>

        <MainVerificationForm step={step} setStep={setStep} />
      </DialogContent>
    </Dialog>
  );
}

const MainVerificationForm = ({
  step,
  setStep,
}: {
  step: string;
  setStep: (s: any) => void;
}) => {
  const [query, setQuery] = useState<{
    nin: string;
    photo: string | null;
  }>({ nin: "", photo: null });

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const {setAlert} = useAlert()

  const handleVerify = async () => {
    if (!query.nin || !query.photo) return;

    try {
      setLoading(true);
       console.log(query)

      const res = await fetch("/api/nimc/verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nin: query.nin,
          image: query.photo,
        }),
      });

      const data = await res.json();
      console.log(data)
      setResult(data);
      setStep("result");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

 

  return (
    <div className="w-full flex flex-col gap-5 mt-2">
      {/* INTRO */}
      {step === "intro" && (
        <div className="flex flex-col items-center gap-4">
          <span className="p-6 flex items-center justify-center rounded-full bg-blue-500">
            <IdCard className="size-10 text-white" />
          </span>

          <p className="text-center text-xs max-w-[300px] flex flex-col items-center gap-2">
            Verify your identity with NIMC to access all features and build trust in the RentCreeb community.
            <span className="text-[10px] text-muted-foreground text-center">
            Verification takes less than 2 minutes
          </span>
          </p>
          
          

          <Button onClick={() => setStep("nin")} className="w-full">
            Verify With NIN
          </Button>

          <p className="text-[11px] text-muted-foreground text-center">
            🔒 Your data is encrypted and secure
          </p>
        </div>
      )}

      {/* STEP 1: NIN INPUT */}
      {step === "nin" && (
        <>
          <div className="flex flex-col gap-1">
            <p className="text-xs font-medium">
              National Identification Number (NIN)
            </p>

            {/* <Input
              placeholder="Enter 11-digit NIN"
              value={query.nin}
              onChange={(e) =>
                setQuery({ ...query, nin: e.target.value })
              }
              type="number"
            /> */}
                <InputOTP 
                  id="digits-only" 
                  maxLength={11} 
                  pattern={REGEXP_ONLY_DIGITS}
                  value={query.nin}
                  onChange={(e) =>
                    setQuery({ ...query, nin: e })
                  }
                >
                  <InputOTPGroup className="w-full">
                  <InputOTPSlot index={0} className="w-full h-10"/>
                  <InputOTPSlot index={1} className="w-full h-10"/>
                  <InputOTPSlot index={2} className="w-full h-10"/>
                  <InputOTPSlot index={3} className="w-full h-10"/>
                  <InputOTPSlot index={4} className="w-full h-10"/>
                  <InputOTPSlot index={5} className="w-full h-10"/>
                  <InputOTPSlot index={6} className="w-full h-10"/>
                  <InputOTPSlot index={7} className="w-full h-10"/>
                  <InputOTPSlot index={8} className="w-full h-10"/>
                  <InputOTPSlot index={9} className="w-full h-10"/>
                  <InputOTPSlot index={10} className="w-full h-10"/>
                  </InputOTPGroup>
                </InputOTP>

            <p className="text-[10px] text-muted-foreground">
              Your NIN is the 11-digit number on your NIMC card
            </p>
          </div>

          <div className="flex items-start gap-2">
            <Checkbox
              checked={agreed}
              onCheckedChange={(val) => setAgreed(!!val)}
              id="nin_confirm"
            />
            <label htmlFor="nin_confirm" className="text-[11px] text-muted-foreground">
              I agree to share my NIN for verification
            </label>
          </div>

          <Button
            className="w-full"
            disabled={query.nin.length !== 11 || !agreed}
            onClick={() => {
              if (query.nin.length < 10) {
                return setAlert("NIN is incorrect.", 'info')
              }
              if (!agreed) {
                return setAlert("agree to terms and condition", 'info')
              }
              return setStep("capture")
            }}
          >
            Continue
          </Button>

          <p className="text-[10px] p-2 bg-blue-100 rounded-xl text-blue-500 text-center">
            🔒 Your data is secure: We use bank-level encryption to protect your information. Your NIN is only used for verification and is not stored in our database.
          </p>
        </>
      )}

      {/* STEP 2: FACE CAPTURE */}
      {step === "capture" && (
          <>
            <AdvancedFaceCapture
              onCapture={(img) =>
                setQuery((prev) => ({ ...prev, photo: img }))
              }
            />

            <Button
              onClick={handleVerify}
              disabled={!query.photo || loading}
              className="w-full"
            >
              {loading ? "Verifying..." : "Verify Identity"}
            </Button>
          </>
        )}

      {/* STEP 3: RESULT */}
      {step === "result" && result && (
        <div className="flex flex-col gap-4 text-center">
          <p className="text-sm font-semibold">
            Verification Result
          </p>

          {/* IMAGES */}
          <div className="flex justify-center gap-4">
            {query.photo && (
              <img
                src={query.photo}
                className="w-24 h-24 rounded-full object-cover border"
              />
            )}

            {result?.ninData?.image && (
              <img
                src={result.ninData.image}
                className="w-24 h-24 rounded-full object-cover border"
              />
            )}
          </div>

          {/* DETAILS */}
          <div className="text-xs space-y-1">
            <p><strong>Name:</strong> {result?.ninData?.full_name}</p>
            <p><strong>DOB:</strong> {result?.ninData?.date_of_birth}</p>
          </div>

          {/* SCORE */}
          <p className="text-sm font-medium">
            Match Score:{" "}
            <span className="text-primary">
              {(result?.faceMatch?.score * 100).toFixed(1)}%
            </span>
          </p>

          {/* STATUS */}
          {result?.faceMatch?.score > 0.8 ? (
            <p className="text-green-600 font-semibold">
              ✅ Verified Successfully
            </p>
          ) : (
            <p className="text-red-600 font-semibold">
              ❌ Verification Failed
            </p>
          )}

          <Button
            variant="outline"
            onClick={() => {
              setStep("intro");
              setResult(null);
              setQuery({ nin: "", photo: null });
            }}
          >
            Done
          </Button>
        </div>
      )}
    </div>
  );
};