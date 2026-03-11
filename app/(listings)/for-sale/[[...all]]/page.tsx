import { _myPropertySort } from "@/_data/_propertyDefault";
import { getUserFavourites } from "@/actions/favourites";
import { getProperties } from "@/actions/properties";
import ClientListProperties from "@/sections/property/clientListProperties";
import { SearchPropertySchemaType } from "@/sections/SearchForms/formSchemas";

export const maxDuration = 60;

type ListingsProps = {
  searchParams: Record<string, string | string[] | undefined>;
};

export default async function ForSale({ searchParams }: ListingsProps) {
  const favs = await (await getUserFavourites()).data;

  const getSearchParams = await searchParams

  const page = Number(getSearchParams.page || 1);
  const limit = Number(getSearchParams.limit || 20);

  const cleanedQuery = Object.fromEntries(
    Object.entries(getSearchParams).filter(
      ([_, value]) =>
        value !== undefined &&
        value !== "" &&
        !(Array.isArray(value) && value.length === 0)
    )
  ) as Partial<SearchPropertySchemaType>;
  const newQuery = {...cleanedQuery, listenIn: 'for-sale'}

  const { properties } = await getProperties({
    filters: newQuery,
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