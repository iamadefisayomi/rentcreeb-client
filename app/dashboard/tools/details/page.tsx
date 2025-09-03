import { getProfessionalDetail } from "@/actions/professional";
import { ProfessionalDetailType } from "@/sections/dashboard/formSchemas";
import ProfessionalDetails from "@/sections/dashboard/professionalDetails";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Tools - Professional Details",
    description: "Manage all your activities here",
  };
  

export default async function Page () {
    const details = (await getProfessionalDetail()).data as ProfessionalDetailType
    return <ProfessionalDetails details={details} title="professional details"/>
}