import { getProperties } from "@/actions/properties";
import SingleProperty from "@/sections/property/singleProperty";
import { Fragment } from "react";

type ListingsProps = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
};

export default async function ForRent ({ searchParams }: ListingsProps) {
  const resolvedSearchParams = await searchParams;
  const cleanedQuery = Object.fromEntries(
  Object.entries(resolvedSearchParams).filter(
    ([_, value]) => value !== undefined
  )
) as Record<string, string | string[]>;
  
  const latestProperties = (await getProperties({})).data;

  return (
      <Fragment>
          {
          latestProperties && latestProperties.length > 0 && (
            latestProperties.map((property: any, index: number) => (
              <SingleProperty property={property as any} key={index}/>
            ))
          )
          }
      </Fragment>
  );
}
