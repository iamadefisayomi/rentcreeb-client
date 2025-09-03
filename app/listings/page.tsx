import { getProperties } from "@/actions/properties";
import LayoutWithImageHeader from "@/components/layoutWithImageHeader";
import PropertyNotFound from "@/sections/listings/propertyNotFound";
import SingleProperty from "@/sections/property/singleProperty";
import HomeFilterForm from "@/sections/SearchForms/HomeFilterForm";
import { HomeSearchBox } from "@/sections/SearchForms/HomeSearchBox";

type ListingsProps = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
};

export default async function Listings({ searchParams }: ListingsProps) {
  const resolvedSearchParams = await searchParams;
  const cleanedQuery = Object.fromEntries(
  Object.entries(resolvedSearchParams).filter(
    ([_, value]) => value !== undefined
  )
) as Record<string, string | string[]>;
  
  const latestProperties = (await getProperties({query: cleanedQuery})).data;

  return (
    <LayoutWithImageHeader
      title="Property Listing"
      bgImage="https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      component={
        <div className="p-2 w-full flex items-center justify-center absolute top-52 md:relative z-20 md:top-0">
          <HomeSearchBox />
        </div>
      }
    >
      <div className="py-32 md:hidden flex" />
      <div className="w-full mx-auto flex items-start pb-10">
        <div className="w-full hidden flex-col items-start max-w-xs md:flex">
          <HomeFilterForm />
          <PropertyNotFound />
        </div>

        {/* Property Listings */}
          {latestProperties && latestProperties.length > 0 ? (
            <div className="w-full  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:p-10 p-6 ">
            {latestProperties.map((property: any, index: number) => (
              <SingleProperty property={property as any} key={index}/>
            ))}
            </div>
          ) : (
            <div className="w-full flex items-center justify-center py-20">
              <img src="/emptyHouseSearch.svg" alt="" className="w-[600px]" />
            </div>
          )}
      </div>
    </LayoutWithImageHeader>
  );
}
