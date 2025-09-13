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

export default function MessageLayout ({children, user, userChats}: MessageLayoutProps) {
   const [filteredChats, setFilteredChats] = useState(userChats)
    return (
        <BaseLayout disableFooter>
            <div className="w-full max-w-7xl h-[calc(100vh-75px)] m-auto overflow-hidden flex items-center justify-center">
                <div className="w-full rounded-xl border h-[90%] overflow-hidden bg-white flex flex-col items-start p-6 gap-6">
                    <h1 className="scroll-m-20 text-start capitalize text-sm text-slate-700 font-semibold tracking-tight text-balance">
                        messages
                    </h1>

                    <div className="w-full border rounded-xl flex flex-grow overflow-hidden">

                        {/* side bar */}
                        <div className="w-full h-full flex flex-col gap-3 overflow-hidden flex-grow border-r max-w-[350px] p-2">
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
        </BaseLayout>
    )
}