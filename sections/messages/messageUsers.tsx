"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Ellipsis } from "lucide-react"

export function DefaultUserCard({ user }: { user: any }) {

   const avatarFallback = user?.name?.slice(0, 2) || user?.email?.slice(0, 2) || "G";

  if (!user) {
    // Skeleton when no user
    return (
      <div className="w-full flex items-center gap-2 justify-between">
        <div className="w-full flex items-center gap-1">
          <Skeleton className="size-14 rounded-full" />
          <div className="flex flex-col gap-1">
            <Skeleton className="h-3 w-24 rounded" />
            <Skeleton className="h-3 w-16 rounded" />
          </div>
        </div>
        <Skeleton className="w-4 h-4 rounded" />
      </div>
    )
  }

  // Normal state
  return (
    <div className="w-full flex items-center gap-2 justify-between">
      <div className="w-full flex items-center gap-1">
        <Avatar className="w-14 h-14 border-2 border-white cursor-default">
          <AvatarImage src={user?.image || ""} className="object-cover w-full h-full" />
          <AvatarFallback className="uppercase text-md font-medium text-primary">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <h4 className="text-[11px] font-medium">{user?.name || user?.email || "Guest"}</h4>
          <p className="text-[10px] text-muted-foreground">{user?.role}</p>
        </div>
      </div>
      <button>
        <Ellipsis className="w-4 text-muted-foreground" />
      </button>
    </div>
  )
}
