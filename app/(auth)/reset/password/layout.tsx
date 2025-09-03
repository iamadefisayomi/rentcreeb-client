import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Reset Password",
  description:
    "Reset your password quickly and securely. Regain access to your account and continue enjoying your personalized experience.",
};

export default function Layout ({children}: {children: ReactNode}) {
    return <>{children}</>
}