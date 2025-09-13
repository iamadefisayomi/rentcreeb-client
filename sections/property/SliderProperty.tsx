"use client"

import { ArrowRight, Bath, BedDouble, MapPin, Ratio, Sparkle } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Skeleton } from "@/components/ui/skeleton";
import React, { ReactElement, useEffect, useMemo, useRef, useState } from "react";
import Autoplay from "embla-carousel-autoplay"
import Image from 'next/image'
import { Button } from '@/components/ui/button';
import currency from "currency.js";
import { usePathname, useRouter } from "next/navigation";
import LoveButton from "./singleProperty/LoveButton";
import { _properties } from "@/_data/images";


export default async function SliderProperty ({ property, favourites }: { property: any, favourites: string[]}) {
  const router = useRouter();
  const pathname = usePathname();

  const { listedIn, type, state, city, lga, slug } = property || {};
  const propertyUrl = (`/property/${slug}`).toLowerCase()

  useEffect(() => {
    if (propertyUrl) {
      router.prefetch(`/${propertyUrl}`);
    }
  }, [router, property?._id, propertyUrl]);

  const handleopenProperty = () => {

  }

  return (
    <div className="w-full rounded-2xl p-[6px] bg-white shadow-sm border flex flex-col justify-between">
      <div className="w-full">
        <ImageSlider
          component={
            <LoveButton
              propertyId={property._id}
              favourites={favourites}
            />
          }
          // images={property?.images?.map((image: string) => (typeof image === "string" ? image : "")).filter(Boolean) || []}
          images={_properties.map(res => res.image).map((image: string) => (typeof image === "string" ? image : "")).filter(Boolean) || []}
        />
      </div>

      <div className="w-full flex flex-col items-start justify-between gap-2 px-2 py-3 flex-grow" onClick={() => router.push(`/property/${property?._id}`)}>
        <div className="flex flex-col gap-1 items-start">
          <h3 className="text-xs text-slate-800 capitalize font-bold tracking-tight">
            {property?.title}
          </h3>

          <p className="flex items-center gap-2 text-muted-foreground text-[11px] font-medium capitalize">
            <MapPin className="w-4 text-primary" /> {`${property?.state}, ${property?.city}`}
          </p>
        </div>

        <p className="text-[11px] text-muted-foreground py-2">
          {property?.description?.split(" ").slice(0, 30).join(" ") + (property?.description?.split(" ").length > 30 ? "..." : "")}
        </p>

        <div className="w-full flex items-center justify-between gap-4">
          <span className="flex items-center gap-2 text-[11px] capitalize text-muted-foreground">
            <BedDouble className="w-4 text-primary" /> {property.bedrooms} Beds
          </span>
          <span className="flex items-center gap-2 text-[11px] capitalize text-muted-foreground">
            <Bath className="w-4 text-primary" /> {property.bathrooms} Baths
          </span>
          <span className="flex items-center gap-2 text-[11px] lowercase text-muted-foreground">
            <Ratio className="w-4 text-primary" /> 8x10 m<sup className="-ml-2">2</sup>
          </span>
        </div> 

      </div>

      <div className="w-full flex items-center justify-between gap-2 px-2 py-3 border-t">
        <h3 className="text-sm font-medium">{currency(property.price, { symbol: "₦", precision: 2 }).format()} / <span className="text-[11px] text-muted-foreground">year</span></h3>
        <Button
          onClick={() => router.push(propertyUrl)}
          size="icon"
          className="rounded-full"
        >
          <ArrowRight className="w-[13px]" />
        </Button>
       </div>
    </div>
  );
}




export function ImageSlider({ images = [], component }: { images?: string[], component: ReactElement }) {

  const randomDelay = useMemo(() => Math.floor(Math.random() * (5000 - 2000 + 1)) + 2000, []);
  const pluginRef = useRef(Autoplay({ delay: randomDelay, stopOnInteraction: true }));
  const [loading, setLoading] = useState(true);

  return (
      <Carousel
        plugins={[pluginRef.current]}
        className="w-full relative h-[200px] max-h-[200px] overflow-hidden rounded-xl"
        onMouseEnter={() => pluginRef.current.stop()}
        onMouseLeave={() => pluginRef.current.play()}
      >
        {/* <div className="absolute top-3 left-3 z-10">
          <Button size="sm" className="rounded-full flex items-center gap-1 text-[11px] capitalize">
            <Sparkle className="w-4" /> Popular
          </Button>
        </div> */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-4">
          <CarouselPrevious className="border-none relative left-0 top-3" />
          <CarouselNext className="border-none relative left-0 top-3" />
        </div>
        <div className="absolute right-0 bottom-0 p-3 rounded-xl items-center z-10">
          {component}
        </div>

        <CarouselContent className="rounded-md">
          {images.length === 0 ? (
            <CarouselItem>
              <Skeleton className="w-full rounded-xl h-[200px]" />
            </CarouselItem>
          ) : (
            images.map((image, index) => (
                  <Image
                    src={image}
                    alt={`Image ${index + 1}`}
                    width={300}
                    height={300}
                    className={`object-cover w-full h-full rounded-xl transition-opacity duration-300 ${
                      loading ? "opacity-70" : "opacity-100"
                    }`}
                    loading="lazy"
                    unoptimized
                    onLoad={() => setLoading(false)}
                  />
            ))
          )}
        </CarouselContent>
      </Carousel>
  );
}