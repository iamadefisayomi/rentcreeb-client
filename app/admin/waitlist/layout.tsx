import { ReactNode } from "react";
import { Metadata } from "next";
import BaseLayout from "@/sections/layout";

export const metadata: Metadata = {
  title: "Waitlist Admin | RentCreeb",
  description: "RentCreeb waitlist administration dashboard.",

  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function Layout({
  children,
}: {
  children: ReactNode;
}) {
  return <BaseLayout>{children}</BaseLayout>;
}