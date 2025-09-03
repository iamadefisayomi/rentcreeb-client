import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "New Password",
  description:
    "Enter your new password quickly and securely. Regain access to your account and continue enjoying your personalized experience.",
};

export default function Layout ({children}: {children: ReactNode}) {
    return <>{children}</>
}