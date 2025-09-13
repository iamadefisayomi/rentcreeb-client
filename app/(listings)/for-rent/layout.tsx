import { ReactNode } from "react";
import { cookies } from "next/headers";
import ListingsLayout from "../ListingsLayout";

type Props = {
  params: Promise<{ all: string[] }>;
};

export async function generateMetadata({ params }: Props) {
  const cookieStore = await cookies();
  const searchCookie = cookieStore.get("propertySearchForm");

  // Safely parse cookie
  let location: {
    state?: string;
    lga?: string;
    city?: string;
    type?: string;
  } = {};

  if (searchCookie?.value) {
    try {
      location = JSON.parse(searchCookie.value);
    } catch (error) {
      console.error("Invalid propertySearchForm cookie:", error);
    }
  }

  const { state, lga, city, type } = location;

  const locationParts = [city, lga, state].filter(Boolean).join(", ") || "Nigeria";

  return {
    title: `${type || "Houses & Apartments"} for Rent in ${locationParts}`,
    description:
      "Find the best houses, flats, and apartments for rent in Nigeria. Browse verified listings across Lagos, Abuja, Port Harcourt, and more. Start your rental search today with RentCreeb.",
  };
}

export default async function Layout ({children}: {children: ReactNode}) {
  
    return (
        <ListingsLayout>
            {children}
        </ListingsLayout>
    )
}