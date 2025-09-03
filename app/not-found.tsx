import NotFound from "@/components/NotFound";
import { Metadata } from "next";

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

// Dynamic metadata
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  if (searchParams?.status === "coming-soon") {
    return {
      title: "Coming Soon | RentCreeb INC.",
      description: "This page or feature is not yet available. Stay tuned!"
    };
  }

  return {
    title: "404 - Page Not Found | RentCreeb INC.",
    description: "The page you are looking for does not exist or has been moved."
  };
}

export default function Error404 () {
  return <NotFound />
}
