import NotFound from "@/components/NotFound";
import { Metadata } from "next";

export const metadata: Metadata = {
   title: "404 - Page Not Found | RentCreeb INC.",
    description: "The page you are looking for does not exist or has been moved."
}

export default function Error404 () {
  return <NotFound />
}
