"use client"

import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
  import { Button } from "@/components/ui/button"
import { SlidersHorizontal } from "lucide-react"
import HomeFilterForm from "./HomeFilterForm"
import { useState } from "react"


  
  export default function MobileFilter () {
    const [open, setOpen] = useState(false)
    return (
      <AlertDialog onOpenChange={setOpen} open={open}>
        <AlertDialogTrigger asChild>
          <Button className="bg-background w-12 hover:bg-muted h-10" size='icon'>
            <SlidersHorizontal className="w-4 text-black" />
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent className="border-none p-0 overflow-y-auto w-full h-screen pb-10 bg-slate-900" >
          <HomeFilterForm onClose={() => setOpen(false)} />
        </AlertDialogContent>
      </AlertDialog>
    )
  }

