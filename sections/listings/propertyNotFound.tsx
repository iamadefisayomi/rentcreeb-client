"use client"

import { Button } from "@/components/ui/button"
import Routes from "@/Routes"
import { useRouter } from "next/navigation"

const PropertyNotFound = () => {
    const router = useRouter()
  return (
    <div className="p-8 flex flex-col items-start pl-10 gap-2 bg-slate-900 border-b border-muted-foreground">
      <h2 className="text-lg text-left font-semibold text-white">Didn’t find what you <br /> are looking for?</h2>
      <p className="text-xs text-white">Let us know your specification and our team will reach out to assit.</p>
      <Button onClick={() => router.push(Routes.contact)} className="w-full h-12 mt-4">
        Get in Touch
      </Button>
    </div>
  )
}

export default PropertyNotFound