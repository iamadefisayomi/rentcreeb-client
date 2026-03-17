import { _myPropertySort } from "@/_data/_propertyDefault";
import { getUserFavourites } from "@/actions/favourites";
import { getProperties } from "@/actions/properties";
import ClientListProperties from "@/sections/property/clientListProperties";
import { SearchPropertySchemaType } from "@/sections/SearchForms/formSchemas";

export const maxDuration = 60;

type ListingsProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ForRent({ searchParams }: ListingsProps) {
  // 1. Await searchParams (Required in newer Next.js versions)
  const resolvedParams = await searchParams;
  
  const favs = (await getUserFavourites()).data;

  const page = Number(resolvedParams.page || 1);
  const limit = Number(resolvedParams.limit || 20);

  // 2. Clean the query
  const cleanedQuery = Object.fromEntries(
    Object.entries(resolvedParams).filter(
      ([_, value]) =>
        value !== undefined &&
        value !== "" &&
        !(Array.isArray(value) && value.length === 0)
    )
  ) as Partial<SearchPropertySchemaType>;

  const { listedIn: _unused, ...otherFilters } = cleanedQuery;

  // 4. Fetch properties with the hardcoded filter
  const { properties, similarProperties, recommended } = await getProperties({
    filters: { 
        ...otherFilters, 
        listedIn: 'for-rent' 
    },
    page,
    limit,
  });

  return (
    <ClientListProperties
      initialProperties={properties}
      initialPage={page}
      favs={favs}
      limit={limit}
    />
  );
}