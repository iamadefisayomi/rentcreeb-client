import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
    title: "Authentication error",
    description: "an error occured with the server."
  };

export default function Layout ({children}: {children: ReactNode}) {
    return <>{children}</>
}