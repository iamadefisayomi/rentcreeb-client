import { Metadata } from "next";
import { ReactNode } from "react";
import RootLayout from "@/sections/layout";

export const metadata: Metadata = {
  title: "Gallery ",
  description: "checkout our gallery."
};

export default function Layout ({children}: {children: ReactNode}) {
    return <RootLayout>{children}</RootLayout>
}