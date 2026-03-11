"use client"

import { Bath, BedDouble, CarFront, Loader2, MapPin, User } from "lucide-react";
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
import { cn } from "@/lib/utils";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import dayjs from "dayjs";
import LoveButton from "./LoveButton";


export default function PropertyLayout ({ property, favourites }: { property: any, favourites?: string[]}) {
  const router = useRouter();

  const { slug } = property || {};
  const propertyUrl = (`/property/${slug}`).toLowerCase()
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (propertyUrl) {
      router.prefetch(`/${propertyUrl}`);
    }
  }, [router, property?._id, propertyUrl]);

  const handleClick = () => {
    startTransition(() => {
      router.push(propertyUrl);
    })
  }

  return (
    <div className={cn("w-full bg-white rounded-2xl border gap-2")}>
        <ImageSlider
              images={property?.images?.map((image: string) => (typeof image === "string" ? image : "")).filter(Boolean) || []}
              listedIn={property?.listedIn}
              component={
                  <LoveButton
                      propertyId={property._id}
                      favourites={favourites}
                  />
              }
          />

          <div className="w-full p-4 flex flex-col gap-2">
                <h3 className="text-md text-slate-700 capitalize font-semibold tracking-tight">
                    {property?.title}
                </h3>

                <p className="flex items-center gap-2 text-muted-foreground text-xs font-medium capitalize">
                    <MapPin className="w-4 text-muted-foreground" /> {`${property?.city} , ${property?.state}`}
                </p>

                {/* <div className={cn("w-full flex items-center justify-between gap-2")}>
                  <span className="text-[11px] capitalize flex items-center gap-2 font-medium text-gray-700">
                    <BedDouble className="w-4 text-primary" /> {property?.bedrooms} Beds
                  </span>

                  <span className="h-1 w-4 bg-primary rounded-full" />
                  <span className="text-[11px] capitalize flex items-center gap-2 font-medium text-gray-700">
                    <Bath className="w-4 text-primary" /> {property?.bathrooms} Baths
                  </span>
                  <span className="h-1 w-4 bg-primary rounded-full" />
                  <span className="text-[11px] capitalize flex items-center gap-2 font-medium text-gray-700">
                    <CarFront className="w-4 text-primary" />{property?.parking} parks
                  </span>
              </div>  */}

                <div className="w-full flex items-center justify-between">
                  <h3 className="text-[16px] font-medium text-primary">{currency(property?.price, { symbol: "₦", precision: 2 }).format()} <span className="text-[10px] font-medium text-muted-foreground">{property?.paymentFrequency && `/${property?.paymentFrequency}`}</span></h3>

                  <PropertyAgent agent={property?.userId} />
                  
                </div>

              <Button variant='ghost' onClick={handleClick} className="border-primary bg-muted border text-primary capitalize flex items-center gap-2">
                {isPending && <Loader2 className="size-4 animate-spin duration-500" />}
                View Details
              </Button>
          </div>
    </div>
  );
}



export function ImageSlider({
  images = [],
  component,
  listedIn,
}: {
  images?: string[]
  component: ReactElement
  listedIn?: string
}) {
  const randomDelay = useMemo(
    () => Math.floor(Math.random() * (5000 - 2500 + 1)) + 2500,
    []
  )

  const pluginRef = useRef(
    Autoplay({ delay: randomDelay, stopOnInteraction: true })
  )

  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!api) return
    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  return (
    <Carousel
      plugins={[pluginRef.current]}
      className="w-full relative h-64 overflow-hidden rounded-t-xl group/slider-image"
      onMouseEnter={() => pluginRef.current.stop()}
      onMouseLeave={() => pluginRef.current.play()}
      setApi={setApi}
      opts={{ loop: true }}
    >
      {/* Listed Badge */}
      {listedIn && (
        <div className="absolute top-3 right-3 z-10">
          <span className="bg-primary p-1 rounded-2xl text-[10px] px-2 capitalize text-white">
            {listedIn.replaceAll("-", " ")}
          </span>
        </div>
      )}

      {/* Arrows */}
      <div className="absolute top-1/2 hidden group-hover/slider-image:flex w-full -translate-y-1/2 z-10 justify-between p-2">
        <CarouselPrevious className="border-none text-slate-900" />
        <CarouselNext className="border-none text-slate-900" />
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 hidden group-hover/slider-image:flex w-full z-10 justify-between items-center p-2 bg-gradient-to-t from-black/40 to-transparent">
        <p className="text-xs font-medium text-white">
          {current} / {count}
        </p>
        {component}
      </div>

      {images.length === 0 ? (
        <CarouselContent>
          <CarouselItem>
            <Skeleton className="w-full h-64 rounded-t-xl" />
          </CarouselItem>
        </CarouselContent>
      ) : (
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <div className="relative w-full h-64">
                <Image
                  src={image}
                  alt={`Property image ${index + 1}`}
                  fill
                  priority={index === 0} // preload first image
                  sizes="(max-width: 768px) 100vw, 33vw"
                  placeholder="blur"
                  blurDataURL="/blur-placeholder.png" // use small base64 or static blur image
                  className="object-cover object-top rounded-t-xl transition-opacity duration-500 ease-in-out"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      )}
    </Carousel>
  )
}

export function convertNameToShort(name: string) {
  if (!name) return "";

  const parts = name.trim().split(/\s+/);

  if (parts.length === 0) return "";

  const firstName = parts[0].toLowerCase();

  const initials = parts
    .slice(1)
    .map((n) => n[0].toUpperCase())
    .join(".");

  return initials ? `${firstName} ${initials}.` : firstName;
}

type AgentProps = {
  agent: {
    image?: string, name?: string, createdAt: Date, email: string
  }
}

export function PropertyAgent ({agent} : AgentProps) {
  const {createdAt, image, name, email} = agent
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link" className="text-[10px] font-medium capitalize text-muted-foreground  flex items-center gap-2">
          <User className="size-4" /> {name && convertNameToShort(name)}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between gap-4">
          <Avatar>
            <AvatarImage src={image} />
            <AvatarFallback>{name?.slice(0, 2)}</AvatarFallback>
          </Avatar>

          <div className="space-y-3">
            <h4 className="text-xs capitalize font-medium text-slate-700">{name}</h4>
            <p className="text-[11px] lowercase text-muted-foreground">
              {email}
            </p>
            <div className="text-muted-foreground text-[11px]">
              Joined {dayjs(createdAt).format("MMMM YYYY")}
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}