import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Terms and Conditions ",
  description: "Read the detailed terms and conditions of Rent House INC, outlining user responsibilities, rental policies, payment terms, and more.",
};

export default function Layout ({children}: {children: ReactNode}) {
    return <>{children}</>
}