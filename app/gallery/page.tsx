"use client";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { _properties } from "@/_data/images";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HomeSearchBox } from "@/sections/SearchForms/HomeSearchBox";
import { useEffect, useState } from "react";

export default function Gallery() {
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
    <div className="mx-auto w-full flex items-center flex-col gap-6 pt-6 pb-10 bg-slate-900">
      <HomeSearchBox />

      <div className="w-full grid sm:grid-cols-3 grid-cols-2 px-1  lg:grid-cols-5 gap-1">
        {[..._properties, ..._properties, ..._properties].map(({ image }, index) => (
          <Dialog key={index} onOpenChange={(open) => open && setSelectedIndex(index)}>
            <DialogTrigger asChild>
              <img
                src={image}
                alt={`Property ${index + 1}`}
                className="w-full h-full flex object-cover aspect-square rounded-lg md:rounded-none cursor-pointer"
              />
            </DialogTrigger>

            <DialogContent
              overlayClassName="bg-black/95 z-[100]"
              className="w-full z-[100] bg-transparent flex items-center justify-center border-0 sm:max-w-4xl h-[70vh] p-0"
            >
              <Carousel setApi={setApi} className="w-full max-w-2xl">
                <CarouselContent>
                  {[..._properties, ..._properties, ..._properties].map(({ image }, index) => (
                    <CarouselItem key={index}>
                      <div className="p-1">
                        <img
                          src={image}
                          alt={`Property ${index + 1}`}
                          className="w-full h-full flex object-cover aspect-square"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                

                {/* Dot Slider */}
                <div className="w-full flex items-center justify-center md:justify-between p-2">
                  <div className="relative items-center gap-4 hidden md:flex">
                  <CarouselPrevious className="left-0 size-6"/>
                  <CarouselNext className="left-10 size-6"/>
                  </div>
                <div className="flex justify-center space-x-2 mt-4">
                  {[..._properties, ..._properties, ..._properties].map((_, index) => (
                    <button
                      key={index}
                      className={`w-2 h-[3px] rounded-full transition-all ${
                        index === current ? "bg-white" : "bg-gray-500"
                      }`}
                      onClick={() => api?.scrollTo(index)}
                    />
                  ))}
                </div>
                </div>
              </Carousel>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  );
}
