"use client"

import { ReactNode, useState } from "react";
import BaseLayout from "@/sections/layout";
import { BetterAuthUser } from "@/types/betterAuthType";
import { DefaultUserCard } from "./messageUsers";
import SearchMessage from "./SearchMessage";
import ChatList from "./ChatList";


type MessageLayoutProps = {
    children: ReactNode;
    user?: BetterAuthUser & { role: string };
    userChats?: any;
}

export default function MessageContainer ({children, user, userChats}: MessageLayoutProps) {
   const [filteredChats, setFilteredChats] = useState(userChats)
    return (
            <div className="w-full h-[calc(100vh-180px)] m-auto overflow-hidden">
                <div className="w-full h-full overflow-hidden bg-white flex flex-col items-start gap-2">
                    <h1 className="text-xs font-semibold capitalize pb-4">
                        messages
                    </h1>

                    <div className="w-full border rounded-xl flex flex-grow overflow-hidden">
                        {/* side bar */}
                        <div className="w-full h-full flex flex-col gap-3 overflow-hidden flex-grow border-r max-w-[250px] p-2">
                            <DefaultUserCard user={user} />
                            <SearchMessage userChats={userChats} onFilter={setFilteredChats} />
                            <ChatList currentUserId={user?.id ?? ""} userChats={filteredChats} />
                        </div>

                        {/* main component */}
                        <div className="w-full h-full flex flex-col gap-3 overflow-hidden flex-grow">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
    )
}