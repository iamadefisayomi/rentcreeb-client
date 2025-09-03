import BaseLayout from "@/sections/layout";
import { ReactNode } from "react";
import MessageComponent from "./MessageComponent";
import { getCurrentUser } from "@/actions/auth";
import { getUserChats } from "@/actions/chat";




export default async function MessageLayout ({children}: {children: ReactNode}) {
    const user = await (await getCurrentUser()).data
    const userChats = await getUserChats(user?.id)
    return (
        <BaseLayout disableFooter>
            <MessageComponent user={user} userChats={userChats}>{children}</MessageComponent>
        </BaseLayout>
    )
}