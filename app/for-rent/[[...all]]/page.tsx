// // app/for-rent/[...all]/page.tsx
// import { notFound } from "next/navigation";


// interface Params {
//   all?: string[];
// }

// export default async function ForRentPage({ params, searchParams }: { params: Params, searchParams: Record<string, string> }) {
//   // Destructure route parts
//   const [state, lga, city] = params.all || [];

//   // Example: Construct query for DB
//   const query: Record<string, any> = { category: "for-rent" };

//   if (state) query.state = state.replace(/-/g, " "); // e.g. lagos-state → Lagos State
//   if (city) query.city = city.replace(/-/g, " ");
//   if (lga) query.lga = lga.replace(/-/g, " ");

//   // Add search filters from query string (?bedrooms=3&priceMax=1000)
//   if (searchParams.bedrooms) query.bedrooms = Number(searchParams.bedrooms);
//   if (searchParams.priceMin) query.price = { ...query.price, $gte: Number(searchParams.priceMin) };
//   if (searchParams.priceMax) query.price = { ...query.price, $lte: Number(searchParams.priceMax) };

//   // 🔍 Example DB fetch
//   // const properties = await db.Property.find(query);

//   // For demo:
//   const properties = [
//     { id: 1, title: "3 Bedroom Apartment", state: "Lagos", city: "Ikeja", lga: "Ojodu" },
//   ];

//   if (!properties.length) return notFound();

//   return (
//     <div>
//       <h1 className="text-2xl font-bold mb-4">
//         Properties for Rent {city ? `in ${city}` : state ? `in ${state}` : ""}
//       </h1>

//       <p className="text-gray-600 mb-4">
//         Found {properties.length} property{properties.length > 1 ? "ies" : "y"}
//       </p>

//       <ul className="grid gap-4">
//         {properties.map((p) => (
//           <li key={p.id} className="border rounded p-4">
//             <h2 className="font-semibold">{p.title}</h2>
//             <p>{p.city}, {p.state}</p> at {query.bedrooms}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
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

export default async function ForRent ({ searchParams }: ListingsProps) {
  const resolvedSearchParams = await searchParams;
  const cleanedQuery = Object.fromEntries(
  Object.entries(resolvedSearchParams).filter(
    ([_, value]) => value !== undefined
  )
) as Record<string, string | string[]>;
  
  const latestProperties = (await getProperties({query: cleanedQuery})).data;

  return (
    <LayoutWithImageHeader
      bgImage="/for-rent.svg"
      className=""
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
