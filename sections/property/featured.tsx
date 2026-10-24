"use client"

import { Skeleton } from "@/components/ui/skeleton";
import PropertyLayout from "./propertyLayout";
import { PropertyDocument } from "@/server/schema/Property";


export default function FeaturedProperties({properties}: {properties: PropertyDocument[]}) {

  return (
    <div className="w-full bg-muted min-h-[50vh] flex flex-col items-center justify-center px-2 py-10">
      <div className="w-full h-full max-w-8xl flex flex-col items-center">
        <div className="w-full flex flex-col gap-1 items-center justify-center">
          <h4 className="text-xs uppercase text-primary">
            Discover your next home
          </h4>
          <h2 className="text-2xl capitalize font-semibold text-slate-700">
            featured properties
          </h2>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-6 px-3 py-6">
          {properties?.map((property: any, idx: number) => (
            <PropertyLayout
              key={property._id.toString()}
              property={property}
            />
          ))}
        </div>
      </div>
    </div>
  );
}


export function FeaturedPropertiesSkeleton() {
  return (
    <div className="w-full min-h-[60vh] bg-white flex flex-col items-center justify-center px-2 py-10">
      <div className="w-full h-full max-w-7xl flex flex-col items-center py-3 rounded-[4px] gap-6">
        <h2 className="text-2xl text-gray-700 font-semibold capitalize">
          featured properties
        </h2>

        <div className="w-full grid grid-cols-3 gap-8 p-8">
          {Array.from({length: 6}).map((property: any, idx: number) => (
            <div key={idx} className="flex flex-col space-y-3">
                <Skeleton className="h-[255px] rounded-xl" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
