import ChangePassword from "@/sections/dashboard/password";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Account - Update Password",
    description: "Manage all your activities here",
  };
  

export default async function Page () {
    return <ChangePassword title="Update Password"/>
}