import { ReactNode } from "react";
import { getCurrentUser } from "@/actions/auth";
import { getUserChats } from "@/actions/chat";
import MessageLayout from "@/sections/messages/MessageLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Messages",
  description:
    "Stay connected with agents and renters through real-time conversations. Manage inquiries, send updates, and keep track of all your property-related messages in one place on the RentCreeb platform.",
};


export default async function Layout ({children}: {children: ReactNode}) {
    const user = await (await getCurrentUser()).data
    const userChats = await getUserChats(user?.id)
    return (
        <MessageLayout user={user} userChats={userChats}>
            {children}
        </MessageLayout>
    )
}