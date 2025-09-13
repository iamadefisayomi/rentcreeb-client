"use client"

import { Search, X } from "lucide-react"
import { useState, useEffect } from "react"

type SearchMessageProps = {
  userChats: any[]
  onFilter: (filtered: any[]) => void
}

export default function SearchMessage({ userChats, onFilter }: SearchMessageProps) {
  const [search, setSearch] = useState("")

  useEffect(() => {
    if (!search.trim()) {
      onFilter(userChats)
      return
    }

    const filtered = userChats.filter((chat) => {
      const name = chat.otherUser?.name?.toLowerCase() || ""
      const email = chat.otherUser?.email?.toLowerCase() || ""
      return name.includes(search.toLowerCase()) || email.includes(search.toLowerCase())
    })

    onFilter(filtered)
  }, [search, userChats, onFilter])

  return (
    <div className="w-full flex items-center bg-slate-50 gap-2 border rounded-lg p-2 relative">
      <Search className="w-4 text-muted-foreground" />
      <input
        type="text"
        placeholder="Search for messages"
        className="text-[10px] outline-none bg-slate-50 border-none text-muted-foreground w-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {search && (
        <button onClick={() => setSearch("")} className="absolute right-2">
          <X className="w-3 text-gray-500" />
        </button>
      )}
    </div>
  )
}
