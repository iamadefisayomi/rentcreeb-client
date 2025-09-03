import PropertyForm from "@/sections/dashboard/PropertyForm";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Tools - Add new property",
    description: "Manage all your activities here",
  };
  

export default async function Page () {
    return <PropertyForm type="new"/>
}