"use client"

import { cn } from "@/lib/utils";
import { Star } from "lucide-react";


export default function Rating ({length=5, className, fill, value, setValue}: {length?: number, className?: string, fill?: string, value?: number, setValue?: any}) {

    return (
        <div className="w-fit flex items-center gap-[2px]">
            {
                Array.from({length}).map((_, index) => (
                    <button key={index} onClick={() => setValue(index+1) ?? null} value={value}>
                        <Star 
                            fill={ value && index+1 <= value ? "currentColor" : fill || 'currentColor'}
                            className={cn("w-4 h-4 text-yellow-400", className)}
                        />
                    </button>
                ))
            }
        </div>
    )
}