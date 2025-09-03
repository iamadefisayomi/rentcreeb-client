import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Contact us ",
  description: "shoot us a message."
};

export default function Layout ({children}: {children: ReactNode}) {
    return <>{children}</>
}