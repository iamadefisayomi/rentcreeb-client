"use client"

import Logo from "@/components/Logo";
import { usePathname } from "next/navigation";

export default function Loading() {
  const pathname = usePathname().slice(1).replaceAll('/', '-');
  return (
    <div className="fixed flex items-center justify-center flex-col gap-3 top-0 left-0 w-full h-[100vh] bg-slate-50">
      <div className="animate-blink">
        <Logo/>
      </div>
      <div className='flex items-center justify-center gap-2 '>
        <p className="text-muted-foreground font-medium text-[10px] capitalize">{pathname}</p>
         <div className="flex space-x-1">
          <div className="w-[4px] h-[4px] bg-primary rounded-full dot1"></div>
          <div className="w-[4px] h-[4px] bg-primary rounded-full dot2"></div>
          <div className="w-[4px] h-[4px] bg-primary rounded-full dot3"></div>
         </div>
      </div>
    </div>
  );
}
