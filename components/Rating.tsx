"use client"

import { cn } from "@/lib/utils";
import { Star } from "lucide-react";


export default function Rating ({length=5, className, fill}: {length?: number, className?: string, fill?: string}) {

    return (
        <div className="w-fit flex items-center gap-[2px]">
            {
                Array.from({length}).map((_, index) => (
                    <Star fill={fill} className={cn("w-4 h-4 text-yellow-400", className)}  key={index}/>
                ))
            }
        </div>
    )
}