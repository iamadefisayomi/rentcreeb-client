"use client";

import React, { useEffect, useState } from "react";
import { ArrowRight, Bath, BedDouble, CarFront, MapPin, Ratio } from "lucide-react";
import LayoutWithImageHeader from "@/components/layoutWithImageHeader";
import { Button } from "@/components/ui/button";
import TestimonialSlider from "@/sections/home/TestimonialSlider";
import { NewPropertySchemaType } from "@/sections/dashboard/formSchemas";
import {
  type CarouselApi,
} from "@/components/ui/carousel"
import currency from "currency.js";
import { useRouter } from "next/navigation";
import MultiImageSlider from "@/components/multiImageSlider";


export default async function ListingDetails({ property, similarProperties }: {property: NewPropertySchemaType, similarProperties?: any}) {
  return (
    <LayoutWithImageHeader
      title={property?.title || "Property Details"}
      bgImage={property?.images?.[0] as string ?? "/placeholder.jpg"} // ✅ Fallback Image
      showCrumbs={false}
      className="hidden"
    >
      <div className="w-full mx-auto flex flex-col px-2">
        <div className="w-full mx-auto max-w-8xl h-[50vh] mt-5 mb-20 relative " 
          style={{
            backgroundImage: `url(${property?.images?.[0]})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: "16px", // Optional: Rounds the edges
          }}
        >

          <div className="w-full flex items-center justify-center border-[7px] border-slate-50 max-w-[93%] sm:max-w-6xl rounded-2xl bg-slate-800 p-6 absolute top-[100%] -translate-y-[50%] left-[50%] -translate-x-[50%]">
            <div className="grid grid-cols-2 sm:grid-cols-4 items-center gap-4 w-full max-w-3xl">
            <InfoItem icon={<BedDouble />} text={`${property?.bedrooms ?? "N/A"} Beds`} />
            <InfoItem icon={<Bath />} text={`${property?.bathrooms ?? "N/A"} Bathrooms`} />
            <InfoItem icon={<Ratio />} text="8 m²" />
            <InfoItem icon={<CarFront />} text={`${property?.parking ?? "N/A"} Parking`} />
            </div>
          </div>
        </div>

        <ImageInformation property={property} />
        <TestimonialSlider />
      </div>
    </LayoutWithImageHeader>
  );
}

const ImageInformation = ({ property }: { property: NewPropertySchemaType }) => {

  const router = useRouter()
  const [lat, lon] = (() => {
  try {
    const coords = property?.location?.coordinates;

    if (Array.isArray(coords) && coords.length === 2) {
      return coords.map((val) => Number(val));
    }

    if (typeof coords === "string") {
      const parsed = JSON.parse(coords);
      if (Array.isArray(parsed) && parsed.length === 2) {
        return parsed.map((val) => Number(val));
      }
    }

    return ["", ""];
  } catch (error) {
    console.error("Invalid coordinates format:", error);
    return ["", ""];
  }
})();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  // Scroll to the selected image when the modal opens
  useEffect(() => {
    if (api && selectedIndex !== null) {
      api.scrollTo(selectedIndex);
    }
  }, [api, selectedIndex]);


  return (
    <div className="w-full mx-auto max-w-8xl flex items-start gap-8 md:flex-row flex-col px-2 py-8">
      <div className="w-full max-w-lg flex flex-col items-start gap-4">
        <Button 
          onClick={() => router.push(`/map?lat=${lat}&lon=${lon}`)} 
          className="flex items-center gap-2">
          <MapPin className="w-4" />
          {property?.address ?? "Address not available"}
        </Button>
        <h1 className="text-2xl capitalize font-bold text-slate-800 text-start">
          {property?.title ?? "No Title"}
        </h1>
        <p className="text-xs text-muted-foreground whitespace-pre-wrap">
          {property?.description ?? "No description available"}
        </p>

        <div className="w-full flex md:items-center justify-between flex-col md:flex-row items-start gap-4">
          <h3 className="text-xl font-medium">
            {currency(property.price, { symbol: "₦", precision: 2 }).format()} <span className="text-[11px] text-muted-foreground">/year</span>
          </h3>
          <Button variant="outline" className="flex items-center gap-2 capitalize w-full md:w-fit">
            Explore Residence
            <ArrowRight className="w-4" />
          </Button>
        </div>
      </div>

      <MultiImageSlider images={property.images || []} limit={6} />
    </div>
  );
};

const InfoItem = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <span className="flex items-center justify-center gap-2 text-xs w-full capitalize text-white border-slate-700 p-3 rounded-lg border cursor-pointer">
    {icon}
    {text}
  </span>
);
