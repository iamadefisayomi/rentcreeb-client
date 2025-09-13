import { getUserFavourites } from "@/actions/favourites";
import { PropertyDocument } from "@/server/schema/Property";
import PropertyLayout from "./propertyLayout";



export default async function SingleProperty ({ property }: { property: PropertyDocument}) {
  const favs = await (await getUserFavourites()).data
  return <PropertyLayout property={property as any} favourites={favs?.map((res: any) => res.id) || []} />
}





