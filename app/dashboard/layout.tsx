import { Metadata } from "next";
import { ReactNode } from "react";
import DashboardLayout from "./DashboardLayout";
import PageTransition from "@/components/PageTransition";
import { getCurrentUser } from "@/actions/auth";
import SetClaims from "@/sections/dashboard/SetClaims";

export const metadata: Metadata = {
  description: "Manage all your activities here",
  title: {
    template: '%s | Rent-House® - Your Trusted Home Rental Partner',
    default: 'Rent-House® - Find Your Perfect Home',
  },
};


export default async function Layout({ children }: { children: ReactNode }) {
  const user = await (await getCurrentUser()).data

  return (
    <DashboardLayout>
      <PageTransition>{children}</PageTransition>
      {!user?.role && <SetClaims />}
    </DashboardLayout>
  );
}
