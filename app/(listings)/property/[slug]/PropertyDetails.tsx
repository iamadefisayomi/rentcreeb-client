"use client";

import React, { useEffect, useState } from "react";
import { Bath, BedDouble, CarFront, MapPin,  Ratio } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  type CarouselApi,
} from "@/components/ui/carousel"
import currency from "currency.js";
import { useRouter } from "next/navigation";
import MultiImageSlider from "@/components/multiImageSlider";
import { _properties } from "@/_data/images";
import BaseLayout from "@/sections/layout";
import Reviews from "@/sections/reviews";
import StartMessageAndBookInspection from "@/sections/messages/StartMessageAndBookInspection";
import { PropertyDocument } from "@/server/schema/Property";
import { ReviewDocument } from "@/server/schema/Review";


export default async function PropertyDetails({ property, reviews }: {property: PropertyDocument, reviews: ReviewDocument[]}) {
  return (
    <BaseLayout>
      <div className="w-full mx-auto flex flex-col px-2">
        <div className="w-full mx-auto max-w-8xl h-[50vh] mt-5 mb-20 relative " 
          style={{
            backgroundImage: `url(${_properties[0]?.image as string })`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: "16px",
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
        {/* <TestimonialSlider /> */}
        <Reviews propertyId={property._id as any} reviews={reviews as any} />
        {/* <FeaturedProperty property={property as any} /> */}
      </div>
    </BaseLayout>
  );
}

const ImageInformation = ({ property }: { property: PropertyDocument }) => {

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
          variant='ghost'
          className="flex items-center gap-2 border-none bg-slate-200">
          <MapPin className="w-4 text-primary" />
          {property?.address ?? "Address not available"}
        </Button>
        <h1 className="text-2xl capitalize font-bold text-slate-800 text-start">
          {property?.title ?? "No Title"}
        </h1>
        <p className="text-xs text-muted-foreground whitespace-pre-wrap">
          {property?.description ?? "No description available"}
        </p>

        <h3 className="text-2xl font-semibold">
          {currency(property.price, { symbol: "₦", precision: 2 }).format()} <span className="text-[11px] text-muted-foreground">/year</span>
        </h3>

        <StartMessageAndBookInspection
          propertyId={property?._id as any}
        />
      </div>

      <MultiImageSlider
        // images={property.images || []}
        images={_properties.map(res => res.image).map((image: string) => (typeof image === "string" ? image : "")).filter(Boolean) || []}
        limit={6} 
      />
    </div>
  );
};

const InfoItem = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <span className="flex items-center justify-center gap-2 text-xs w-full capitalize text-white border-slate-700 p-3 rounded-lg border cursor-pointer">
    {icon}
    {text}
  </span>
);
