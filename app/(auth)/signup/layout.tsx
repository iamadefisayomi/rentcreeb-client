import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
    title: "Create a RentCreeb account",
    description: "reate a new account in seconds. Enjoy secure and seamless access to your personalized experience."
  };

export default async function Layout ({children}: {children: ReactNode}) {
    return <>{children}</>
}