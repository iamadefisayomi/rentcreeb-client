"use client"

import { ReactNode, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "./ui/button";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";



export default function DropDownComp({title, component, className, icon}: {title: string | any, component: ReactNode, className?: string, icon?: ReactNode}) {
    const [open , setOpen] = useState(false)
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild className={cn("w-full", className)}>
          <Button variant="ghost" className={cn("w-full border bg-slate-50 rounded-md flex h-10 items-center justify-between text-muted-foreground capitalize", open && "border-ring ring-ring/50 ring-[3px]", className)}>
            <span>{title}</span>
            { icon || <ChevronDown className={cn("w-4 duration-150", open ? 'rotate-180' : 'rotate-0')}/> }
          </Button>
        </PopoverTrigger>
        <PopoverContent onClick={() => setOpen(false)} className="w-full p-2 max-h-96 overflow-y-auto">{component}</PopoverContent>
      </Popover>
    )
  }