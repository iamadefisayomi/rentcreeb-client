"use client"

import { cn } from "@/lib/utils";
import { Star } from "lucide-react";


export default function Rating ({length=5, className}: {length?: number, className?: string}) {

    return (
        <div className="w-fit flex items-center gap-[2px]">
            {
                Array.from({length}).map((_, index) => (
                    <Star className={cn("w-3 h-3 text-yellow-400", className)}  key={index}/>
                ))
            }
        </div>
    )
}