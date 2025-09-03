"use client"


import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { Metadata } from 'next';
import Image from 'next/image';
import { useState } from 'react';

export const metadata: Metadata = {
  title: "Server Error",
  description: "An unexpected error occurred on the server.",
};

export default function Error500 () {
  const [reload, setReload] = useState(false)
  const handleReload = () => {
    setReload(true)
    window.location.reload()
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
    <Image
      src="/error500.png"
      className="w-48 sm:w-64 h-auto"
      draggable={false}
      alt="Server Error"
      loading="lazy"
      width={200}
      height={200}
    />
    <div className="mt-6 flex flex-col items-center gap-6">
      <h1
        className="text-4xl font-semibold text-slate-800"
        aria-label="Error 500 - Server Issue"
      >
       Service Unavailable!
      </h1>
        <Button onClick={handleReload} className=" px-4 flex items-center gap-2">
          <Loader2 className={cn('w-5 ', reload && "animate-spin duration-1000")} />
          {reload ? "Reloading" : "Reload"} Page
        </Button> 
    </div>
  </main>
  );
};
