import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Our Services",
  description: "Explore our range of services, from property listings to legal advisory, ensuring a seamless rental experience on the RentCreeb platform."
};

export default async function Layout ({children}: {children: ReactNode}) {
    return <>{children}</>
}