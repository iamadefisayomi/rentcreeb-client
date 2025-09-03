"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function SearchBar () {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="rounded-[8px] w-10 h-10 bg-muted" size='icon'>
            <Search className="w-6"/>
        </Button>
      </DialogTrigger>

      <DialogContent className=" top-10 px-2 py-4">
        <Input placeholder="Search properties..." className="h-10" />
      </DialogContent>
    </Dialog>
  )
}
