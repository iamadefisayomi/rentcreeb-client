import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Join the RentCreeb 2.0 Waitlist",
  description:
    "Get early access to RentCreeb 2.0. Join the waitlist to receive exclusive launch updates, priority onboarding, and be among the first to experience Nigeria's next-generation real estate platform.",
};

export default function Layout ({children}: {children: ReactNode}) {
    return <>{children}</>
}