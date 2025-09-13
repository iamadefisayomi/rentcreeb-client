

import { getUserFavourites } from "@/actions/favourites";
import { PropertyDocument } from "@/server/schema/Property";
import SliderProperty from "./SliderProperty";



export default async function SingleProperty({ property }: { property: PropertyDocument}) {
  const favs = await (await getUserFavourites()).data
  return <SliderProperty property={property as any} favourites={favs?.map((res: any) => res.id) || []} />
}





