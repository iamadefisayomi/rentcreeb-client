import { ReactNode } from "react";
import { getCurrentUser } from "@/actions/auth";
import { getUserChats } from "@/actions/chat";
import MessageContainer from "@/sections/messages/MessageContainer";




export default async function Layout ({children}: {children: ReactNode}) {
    const user = await (await getCurrentUser()).data
    const userChats = await getUserChats(user?.id)
    return <MessageContainer user={user} userChats={userChats}>{children}</MessageContainer>
}