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
import Rating from "@/components/Rating";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";
import useResponsive from "@/hooks/useResponsive";

export default function TestimonialSlider() {
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
            Happy Home Owners!
          </h1>
        </div>

        <Carousel
          plugins={[plugin.current]}
          className="w-full"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
          setApi={setApi} // Set the API using the setApi function
        >
          <div className="w-full h-full flex items-center justify-center">
          <div className="absolute hidden md:flex left-0 top-0 h-full w-[35%] bg-gradient-to-r from-slate-100 via-slate-100/0 to-transparent z-10" />
          <CarouselContent>
            {_testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className={` md:pl-4 md:basis-1/3 md:flex-[0_0_50%]`}>
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

const Testimonial = ({ name, role, image, feedback }: typeof _testimonials[0]) => {
  return (
    <div className="w-full p-3 md:p-6 rounded-lg flex bg-white h-64 justify-between border flex-col items-start gap-3">
      <Rating />
      <p className="text-muted-foreground text-[11px]">{feedback}</p>

      <div className="w-fit mx-auto flex items-center gap-1 md:gap-2">
        <img
          src={image}
          alt={name}
          width={200}
          height={200}
          className="w-8 h-8 md:w-10 md:h-10 rounded-sm object-cover"
        />
        <div className="flex flex-col items-start">
          <h4 className="text-[11px] capitalize font-semibold">{name}</h4>
          <h5 className="text-[10px] text-muted-foreground lowercase">{role}</h5>
        </div>
      </div>
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

const _testimonials = [
  {
    id: 1,
    name: "Sarah Thompson",
    role: "Interior Designer",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 5,
    feedback:
      "I absolutely love the attention to detail in these properties. The modern designs, premium finishes, and well-planned spaces make for an amazing living experience. Highly recommended!",
  },
  {
    id: 2,
    name: "James Carter",
    role: "Real Estate Investor",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4,
    feedback:
      "These properties are perfect for long-term investment. The locations are prime, and the designs are built for comfort and functionality. A great choice for anyone looking to invest smartly!",
  },
  {
    id: 3,
    name: "Emily White",
    role: "Freelance Artist",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 5,
    feedback:
      "Living in one of these properties has been a dream. The vibrant surroundings, peaceful atmosphere, and cozy interiors make it a perfect place to call home!",
  },
  {
    id: 4,
    name: "Daniel Lee",
    role: "Software Engineer",
    image: "https://images.unsplash.com/photo-1552058544-f2b08422138a?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4,
    feedback:
      "The high-speed internet and serene environment make this place a paradise for remote workers. I can focus on my work while enjoying the beautiful surroundings.",
  },
  {
    id: 5,
    name: "Olivia Martinez",
    role: "Marketing Manager",
    image: "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 5,
    feedback:
      "A well-connected location with access to everything I need. Shopping, dining, and entertainment are just minutes away. It truly makes city living effortless!",
  },
  {
    id: 6,
    name: "Liam Wilson",
    role: "Architect",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 5,
    feedback:
      "As an architect, I appreciate the fine craftsmanship and design aesthetics in these properties. They blend functionality with artistic elegance beautifully.",
  },
  {
    id: 7,
    name: "Sophia Reynolds",
    role: "Doctor",
    image: "https://images.unsplash.com/photo-1566753323558-f4e0952af115?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4,
    feedback:
      "A peaceful and secure neighborhood, which is exactly what I was looking for. After long shifts, I can unwind in a calm and relaxing environment.",
  },
  {
    id: 8,
    name: "Nathan Brooks",
    role: "Entrepreneur",
    image: "https://images.unsplash.com/photo-1594819047053-29b8c5c7d944?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 5,
    feedback:
      "A fantastic investment! The value of these properties continues to rise, and the community is thriving. A perfect mix of luxury and smart financial planning.",
  },
  {
    id: 9,
    name: "Isabella Garcia",
    role: "Travel Blogger",
    image: "https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 5,
    feedback:
      "A stunning place to live! The scenic views, modern interiors, and overall ambiance make it a photographer’s dream. I can't get enough of this place!",
  },
  {
    id: 10,
    name: "Michael Robinson",
    role: "Financial Analyst",
    image: "https://images.unsplash.com/photo-1595433707802-47ef183dae51?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4,
    feedback:
      "Great amenities and fantastic community. Everything from the fitness center to the green spaces is well-maintained, making it an excellent choice for a healthy lifestyle.",
  },
];
