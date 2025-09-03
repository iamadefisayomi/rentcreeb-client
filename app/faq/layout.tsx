import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Find answers to common questions about using the RentCreeb platform."
};

export default function Layout ({children}: {children: ReactNode}) {
    return <>{children}</>
}