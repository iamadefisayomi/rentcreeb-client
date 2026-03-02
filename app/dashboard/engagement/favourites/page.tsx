import { getUserFavourites } from "@/actions/favourites";
import Favourites from "./Favourites";
import { getCurrentUser } from "@/actions/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Saved Properties",
  description: "Quick access to properties you've marked as favourites",
};

export default async function Page() {
  const favouriteProperties = (await getUserFavourites()).data;
  const user = (await getCurrentUser()).data;

  return (
    <Favourites
      favourites={favouriteProperties as any}
      role={user?.accountType || null}
    />
  );
}
