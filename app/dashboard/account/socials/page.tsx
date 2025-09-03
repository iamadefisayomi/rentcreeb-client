import { getSocial } from "@/actions/social";
import { SocialsType } from "@/sections/dashboard/formSchemas";
import SocialsComponent from "@/sections/dashboard/Socials";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Account - Social Profile",
    description: "Manage all your activities here",
  };
  

export default async function Page () {
    const socials = (await getSocial()).data as SocialsType
    return <SocialsComponent socials={socials} title="social profile"/>
}