import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Property Listing",
  description: "Browse and manage property listings on the RentCreeb platform."
};

export default async function Layout ({children}: {children: ReactNode}) {
    return <>{children}</>
}