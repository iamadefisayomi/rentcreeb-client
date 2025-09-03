"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthErrorPage() {
  const params = useSearchParams();
  const error = params.get("error");
  const description = params.get("error_description") || null
  const router = useRouter()

  return (
    <div className="w-full h-[100vh] flex items-center justify-center">
        <div className="w-full flex flex-col items-center justify-between max-w-[500px] border p-4 aspect-square rounded-md">
            <Image
                src="/server-down.svg"
                alt=""
                fill
                className="object-cover"
            />
            <p className="text-xs text-muted-foreground py-4 text-center">We encountered an issue while processing your request.<br /> Please try again in a short while or 
            <Link href="mailto:support@rentcreeb.com" className="text-primary font-semibold capitalize"> contact us </Link> if problem persists.</p>
            <Button onClick={() => router.back()} size='lg' >
                Return to Application
            </Button>
            <div className="w-full flex items-center justify-center border-t py-5 mt-5 flex-col gap-2">
                <p className="text-xs font-medium text-muted-foreground">Error Code: <strong>{error || "unknown"}</strong></p>
                {
                    description && description !== 'undefined' && <p className="text-xs font-medium text-muted-foreground">{description}</p>
                }
                
            </div>
            
        </div>
    </div>
  );
}