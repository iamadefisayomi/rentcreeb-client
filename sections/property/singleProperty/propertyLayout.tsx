"use client"

import { ArrowRight, Bath, BedDouble, CarFront, Loader2, MapPin, Ratio, Sparkle } from "lucide-react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Skeleton } from "@/components/ui/skeleton";
import React, { ReactElement, useEffect, useMemo, useRef, useState, useTransition } from "react";
import Autoplay from "embla-carousel-autoplay"
import Image from 'next/image'
import { Button } from '@/components/ui/button';
import currency from "currency.js";
import { useRouter } from "next/navigation";
import { _properties } from "@/_data/images";
import { cn } from "@/lib/utils";
import usePageSettings from "@/contexts/usePageSettings";
import LoveButton from "./LoveButton";
import useResponsive from "@/hooks/useResponsive";


export default function PropertyLayout ({ property, favourites }: { property: any, favourites: string[]}) {
  const router = useRouter();
  const {pageViewStyle, setPageViewStyle} = usePageSettings();
  const isDesktop = useResponsive() === 'desktop'
  const isGrid = pageViewStyle === 'grid'

  const { slug } = property || {};
  const propertyUrl = (`/property/${slug}`).toLowerCase()
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (propertyUrl) {
      router.prefetch(`/${propertyUrl}`);
    }
  }, [router, property?._id, propertyUrl]);

  useEffect(() => {
    if (!isDesktop && !isGrid) {
        setPageViewStyle('grid')
    }
  }, [isGrid, isDesktop])

  const handleClick = () => {
    startTransition(() => {
      router.push(propertyUrl);
    })
  }

  return (
    <div className={cn("w-full p-2 bg-white rounded-2xl border gap-2", isGrid ? "flex flex-col gap-2" : "grid grid-cols-5")}>
        <div className={cn(isGrid ? "w-full" : "col-span-2")}>
            <ImageSlider
                images={_properties.map(res => res.image).map((image: string) => (typeof image === "string" ? image : "")).filter(Boolean) || []}
                component={
                    <LoveButton
                        propertyId={property._id}
                        favourites={favourites}
                    />
                }
            />
        </div>

        <div className={cn("flex flex-col gap-2 justify-between flex-grow", isGrid ? "w-full" : "col-span-3 p-3")}>
            <div className={cn("flex flex-col gap-1 items-start", isGrid && "px-3 pt-2")}>
                <h3 className="text-xs text-slate-800 capitalize font-bold tracking-tight">
                    {property?.title}
                </h3>

                <p className="flex items-center gap-2 text-muted-foreground text-[11px] font-medium capitalize">
                    <MapPin className="w-4 text-primary" /> {`${property?.state}, ${property?.city}`}
                </p>
            </div>

            <p className={cn("text-[11px] text-muted-foreground py-2", isGrid && "px-3")}>
                {property?.description?.split(" ").slice(0, 25).join(" ") + (property?.description?.split(" ").length > 30 ? "..." : "")}
            </p>

            <div className={cn("w-full flex items-center gap-2", isGrid && "px-3 pb-2 grid grid-cols-4 gap-2")}>
                <span className="flex items-center gap-2 justify-center text-[11px] border border-blue-200 font-medium  rounded-xl px-3 py-1 capitalize text-slate-900">
                    <BedDouble className="w-4 text-primary" /> {property.bedrooms} Beds
                </span>
                <span className="flex items-center gap-2 justify-center border border-blue-200  rounded-xl px-3 py-1 text-[11px] font-medium capitalize text-slate-900">
                    <Bath className="w-4 text-primary" /> {property.bathrooms} Baths
                </span>
                <span className="flex items-center gap-2 justify-center border border-blue-200 rounded-xl px-3 py-1 text-[11px] font-medium lowercase text-slate-900">
                    <Ratio className="w-4 text-primary" /> 8x10 m<sup className="-ml-2">2</sup>
                </span>
                <span className="flex items-center gap-2 justify-center border border-blue-200 rounded-xl px-3 py-1 text-[11px] font-medium capitalize text-slate-900">
                    <CarFront className="w-4 text-primary" />{property.parking} parks
                </span>
            </div> 

            <div className={cn("w-full flex items-center justify-between gap-2", isGrid && "border-t py-2")}>
                <h3 className="text-md font-bold text-slat-900">{currency(property.price, { symbol: "₦", precision: 2 }).format()} <span className="text-[11px] font-medium text-muted-foreground">/ year</span></h3>
                <Button
                onClick={handleClick}
                size="icon"
                className="rounded-full"
                >
                 {
                    isPending ? <Loader2 className="w-[13px] animate-spin duration-500" /> : <ArrowRight className="w-[13px]" />
                 } 
                </Button>
            </div>
        </div>
    </div>
  );
}




export function ImageSlider({ images = [], component }: { images?: string[], component: ReactElement }) {

  const randomDelay = useMemo(() => Math.floor(Math.random() * (5000 - 2000 + 1)) + 2000, []);
  const pluginRef = useRef(Autoplay({ delay: randomDelay, stopOnInteraction: true }));
  const [loading, setLoading] = useState(true);

    const [api, setApi] = useState<CarouselApi>()
    const [current, setCurrent] = useState(0)
    const [count, setCount] = useState(0)
    useEffect(() => {
        if (!api) {
        return
        }
        setCount(api.scrollSnapList().length)
        setCurrent(api.selectedScrollSnap() + 1)
        api.on("select", () => {
        setCurrent(api.selectedScrollSnap() + 1)
        })
    }, [api])


  return (
      <Carousel
        plugins={[pluginRef.current]}
        className="w-full relative h-52 max-h-52 overflow-hidden rounded-xl"
        onMouseEnter={() => pluginRef.current.stop()}
        onMouseLeave={() => pluginRef.current.play()}
        setApi={setApi}
        opts={{
            loop: true
        }}
      >
        {/* <div className="absolute top-3 left-3 z-10">
          <Button size="sm" className="rounded-full flex items-center gap-1 text-[11px] capitalize">
            <Sparkle className="w-4" /> Popular
          </Button>
        </div>*/}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-4">
          <CarouselPrevious className="border-none relative left-0 top-3 text-slate-900 "/>
          <CarouselNext className="border-none relative left-0 top-3 text-slate-900 " />
        </div>
        <div className="absolute right-0 bottom-0 p-3 rounded-xl items-center z-10">
          {component}
        </div>
         <div className=" absolute z-10 bottom-2 left-2">
            <p className="text-xs font-medium text-slate-950">{`${current} / ${count}`}</p>
         </div>

        <CarouselContent className="rounded-md">
          {images.length === 0 ? (
            <CarouselItem>
              <Skeleton className="w-full rounded-xl h-52" />
            </CarouselItem>
          ) : (
            images.map((image, index) => (
                  <Image
                    src={image}
                    alt={`Image ${index + 1}`}
                    width={300}
                    height={300}
                    className={`object-cover object-top w-full h-full rounded-xl transition-opacity duration-300 ${
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