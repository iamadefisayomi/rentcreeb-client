import { getUserFavourites } from "@/actions/favourites";
import Favourites from "./Favourites";
import { getCurrentUser } from "@/actions/auth";

export default async function Page() {
  const favouriteProperties = (await getUserFavourites()).data;
  const user = (await getCurrentUser()).data
  return <Favourites favourites={favouriteProperties as any} role={user?.role as any || null} />;
}
