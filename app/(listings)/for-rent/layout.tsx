import { ReactNode } from "react";
import { cookies } from "next/headers";
import ListingsLayout from "../ListingsLayout";

type Props = {
  params: { all: string[] };
};

// WeakMap cache keyed by cookie object (auto garbage-collected)
const cookieCache = new WeakMap<object, { state?: string; lga?: string; city?: string; type?: string }>();

export async function generateMetadata({ params }: Props) {
  const cookieStore = await cookies();
  const searchCookie = cookieStore.get("propertySearchForm");

  let location: { state?: string; lga?: string; city?: string; type?: string } = {};

  if (searchCookie) {
    // Check WeakMap cache
    if (cookieCache.has(searchCookie)) {
      location = cookieCache.get(searchCookie)!;
    } else {
      try {
        location = JSON.parse(searchCookie.value);
      } catch {
        if (process.env.NODE_ENV === "development") {
          console.error("Invalid propertySearchForm cookie");
        }
        location = {};
      }
      cookieCache.set(searchCookie, location);
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

export default function Layout({ children }: { children: ReactNode }) {
  return <ListingsLayout>{children}</ListingsLayout>;
}