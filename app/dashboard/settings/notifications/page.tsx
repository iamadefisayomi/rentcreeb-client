import { NotificationType } from "@/sections/dashboard/formSchemas";
import Notifications from "@/sections/dashboard/notifications";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Settings - Alerts & Notification",
    description: "Manage all your activities here",
  };
  

export default async function Page () {
    const notify = {} as NotificationType
    return <Notifications title="alerts & notifications" notify={notify}/>
}