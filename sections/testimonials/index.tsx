"use client"

import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";
import useResponsive from "@/hooks/useResponsive";
import Rating from "@/components/Rating";
import { _testimonials } from "./_testimoanials";

export default function Testimonials () {
  const [api, setApi] = React.useState<CarouselApi | undefined>(undefined);
  const [current, setCurrent] = React.useState(1);
  const [count, setCount] = React.useState(0);
  const isDesktop = useResponsive() === 'desktop'

  React.useEffect(() => {
    if (!api) return;

    // Set count and current when API is initialized
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap() + 1);
    };

    api.on("select", onSelect);

    // Cleanup to avoid memory leaks
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );

  const handleSetActive = (index: number) => api?.scrollTo(index);

  return (
    <div className="w-full bg-slate-100 md:h-[80vh] flex flex-col items-center justify-center">
          <div className="w-full max-w-8xl mx-auto px-4 py-8">
            <div className="w-full flex items-center justify-center flex-col gap-2 mb-6">
              <h2 className="text-xs uppercase text-primary font-medium text-center">
                Hear from our
              </h2>
              <h1 className="text-2xl md:text-3xl md:font-bold capitalize font-semibold text-center">
                Happy Renters
              </h1>
            </div>
    
            <Carousel
              plugins={[plugin.current]}
              className="w-full"
              onMouseEnter={plugin.current.stop}
              onMouseLeave={plugin.current.reset}
              opts={{loop: true}}
              setApi={setApi} // Set the API using the setApi function
            >
              <div className="w-full h-full flex items-center justify-center">
              <div className="absolute hidden md:flex left-0 top-0 h-full w-[35%] bg-gradient-to-r from-slate-100 via-slate-100/0 to-transparent z-10" />
              <CarouselContent>
                {_testimonials.map((testimonial, index) => (
                  <CarouselItem key={index} className={` md:pl-2 md:basis-1/3`}>
                    <div className="p-1">
                      <Testimonial key={testimonial.id} {...testimonial} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="absolute hidden md:flex right-0 top-0 h-full w-[35%] bg-gradient-to-l from-slate-100 via-slate-100/0 to-transparent z-10" />
              </div>
    
              <div className="flex items-center relative justify-center mt-8 gap-1 w-fit mx-auto">
                {isDesktop && <CarouselPrevious variant="ghost" className=""/>}
                <span className=" flex items-center gap-1 w-full h-full">
                  {Array.from({ length: count }).map((_, index) => (
                    <DotButton
                      key={index}
                      onClick={() => handleSetActive(index)}
                      active={index + 1 === current}
                    />
                  ))}
                </span>
                { isDesktop && <CarouselNext variant="ghost" className=""/>}
              </div>
            </Carousel>
          </div>
        </div>
  );
}

const Testimonial = ({ name, role, image, feedback, location, rating, id }: typeof _testimonials[0]) => {
  return (
    <div className="w-full p-3 md:p-6 rounded-lg flex bg-white h-64 justify-center items-center  flex-col gap-5">
      <Rating fill='blue' className="text-primary" length={rating} />
      <p className="text-muted-foreground text-xs text-center">{feedback}</p>
      <h4 className="text-[13px] text-slate-700 capitalize font-semibold text-center">{name}</h4>
      <h5 className="text-xs text-muted-foreground lowercase">{location}</h5>
    </div>
  );
};


const DotButton = ({
  onClick,
  active,
}: {
  onClick: () => void;
  active: boolean;
}) => {
  return (
    <button
      className={cn("w-1 h-1 md:w-[6px] md:h-[6px] rounded-full bg-gray-400", {
        "bg-primary": active,
      })}
      onClick={onClick}
    />
  );
};
