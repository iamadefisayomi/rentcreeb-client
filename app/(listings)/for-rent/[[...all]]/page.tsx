import { _myPropertySort } from "@/_data/_propertyDefault";
import { getUserFavourites } from "@/actions/favourites";
import { getProperties } from "@/actions/properties";
import ClientListProperties from "@/sections/property/clientListProperties";
import { SearchPropertySchemaType } from "@/sections/SearchForms/formSchemas";

type ListingsProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ForRent({ searchParams }: ListingsProps) {

  const favs = await (await getUserFavourites()).data
  const resolvedSearchParams = await searchParams;

  const cleanedQuery = Object.fromEntries(
    Object.entries(resolvedSearchParams).filter(
      ([_, value]) =>
        value !== undefined &&
        value !== "" &&
        !(Array.isArray(value) && value.length === 0)
    )
  ) as unknown as Partial<SearchPropertySchemaType>; // ✅ Fix: cast through `unknown`

  const sortBy = (cleanedQuery as any).sortBy as keyof typeof _myPropertySort;

  const { properties, recommended, similarProperties } = await getProperties({
    filters: cleanedQuery as any,
    sortBy,
    limit: 20,
  });

  return <ClientListProperties initialProperties={properties} filters={cleanedQuery} sortBy={sortBy} favs={favs} />;

}
