"use client"


import { getCurrentUser } from "@/actions/auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BetterAuthUser } from "@/types/betterAuthType";
import { Ellipsis, Search, X } from "lucide-react";
import { ReactNode, useState } from "react";
import ChatList from "./ChatList";


export default function MessageComponent ({children, user, userChats}: {children?: ReactNode, user?: BetterAuthUser & { role: string }, userChats: any}) {

    const avatarFallback = user?.name?.slice(0, 2) || user?.email?.slice(0, 2) || "G";
    const [search, setSearch] = useState("");

    return (
        <div className="w-full overflow-hidden flex flex-col bg-white items-center justify-center h-full " style={{height: 'calc(100vh - 64px)'}}>
            <div className="w-full flex flex-col overflow-hidden max-w-7xl p-4 gap-4 border rounded-[4px] h-[90%]">
                <h1 className="text-sm font-medium capitalize">Messages</h1>
                <div className="w-full border rounded-[4px] grid grid-cols-3 h-[94%]" >
                    {/* SIDEBAR */}
                        <div className="w-full hidden border-r col-span-1 md:flex flex-col gap-3 p-2 py-3 h-full overflow-hidden">
                            <div className="w-full flex items-center gap-2 justify-between">
                            <div className="w-full flex items-center gap-2">
                                <Avatar className="w-[50px] h-[50px] border-2 border-white">
                                <AvatarImage src={user?.image || ""} className="object-cover w-full h-full"/>
                                <AvatarFallback className="uppercase text-sm">
                                    {avatarFallback}
                                </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                <h4 className="text-[11px] font-medium">
                                    {user?.name || user?.email}
                                </h4>
                                <p className="text-[10px] text-muted-foreground">
                                    {user?.role}
                                </p>
                                </div>
                            </div>
                            <button><Ellipsis className="w-4 text-muted-foreground" /></button>
                            </div>
                
                            {/* Search Bar */}
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

                            <ChatList currentUserId={user?.id ?? ''} userChats={userChats} />
                        </div>
                        
                        <div className="w-full overflow-hidden col-span-3 md:col-span-2" style={{ flex: 1 }}>
                            {children}
                        </div>
                </div>
            </div>
        </div>
    )
}