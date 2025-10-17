import { getProperties } from "@/actions/properties";
import SimilarProperty from "@/sections/property/SimilarProperties";
import SingleProperty from "@/sections/property/singleProperty";
import { SearchPropertySchemaType } from "@/sections/SearchForms/formSchemas";
import { Fragment } from "react";

type ListingsProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ForRent({ searchParams }: ListingsProps) {
  const resolvedSearchParams = await searchParams;

  const cleanedQuery = Object.fromEntries(
    Object.entries(resolvedSearchParams).filter(
      ([_, value]) =>
        value !== undefined &&
        value !== "" &&
        !(Array.isArray(value) && value.length === 0)
    )
  ) as unknown as Partial<SearchPropertySchemaType>; // ✅ Fix: cast through `unknown`

  const sortBy = (cleanedQuery as any).sort as string | undefined;

  const { properties, recommended, similarProperties } = await getProperties({
    filters: cleanedQuery as any,
    sortBy,
  });

  return (
    <Fragment>
      {properties && properties.length > 0 ? (
        properties.map((property: any, index: number) => (
          <SingleProperty property={property} key={index} />
        ))
      ) : (
        <div className="text-center py-20 text-gray-500">
          No properties found matching your filters.
        </div>
      )}
      <SimilarProperty 
        similarProperties={recommended as any} 
        city={cleanedQuery?.city} 
        state={cleanedQuery?.state} 
        lga={cleanedQuery?.lga} 
        type={cleanedQuery?.type} 
      />
    </Fragment>
  );
}
