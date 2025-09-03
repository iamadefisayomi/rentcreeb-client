import { getCurrentUserProperties } from "@/actions/properties";
import MyProperty from "@/sections/dashboard/MyProperties";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Tools - My properties",
    description: "Manage all your activities here",
  };
  

export default async function Page () {
  const properties = (await getCurrentUserProperties()).data
    return <MyProperty properties={properties as any}/>
}