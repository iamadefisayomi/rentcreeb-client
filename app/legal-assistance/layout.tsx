import LayoutWithImageHeader from "@/components/layoutWithImageHeader";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Legal Assistance",
  description:
    "Get trusted legal support for tenancy disputes, property verification, and compliance with Rentcreeb Inc. We connect you with verified legal professionals to ensure safe and lawful rental transactions.",
};

export default function Layout ({children}: {children: ReactNode}) {
    return (
      <LayoutWithImageHeader
        title="Legal Assistance"
        bgImage='/legal.jpg'
        subTitle="Trusted legal support for tenants, landlords, and agents on Rentcreeb Inc."
      >
        {children}
      </LayoutWithImageHeader>
    )
}