import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
    title: "Sign In or Create an Account",
    description: "Sign in to your account or create a new one in seconds. Enjoy secure and seamless access to your personalized experience."
  };

export default function Layout ({children}: {children: ReactNode}) {
    return <>{children}</>
}