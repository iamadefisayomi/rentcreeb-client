import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { X } from "lucide-react";

export default function MultiImageSlider({
  images,
  containerClassName,
}: {
  images: (string | File)[];
  containerClassName?: string;
}) {
  const MAX_VISIBLE = 9;
  const sliderImages = images.slice(0, MAX_VISIBLE);
  const remainingCount = images.length - MAX_VISIBLE;

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  useEffect(() => {
    if (api && selectedIndex !== null) {
      api.scrollTo(selectedIndex);
    }
  }, [api, selectedIndex]);

  const onTriggerOpen = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  return (
    <div
      className={cn(
        "w-full grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4",
        containerClassName
      )}
    >
      {sliderImages.map((image, idx) => (
        <Dialog key={idx} onOpenChange={(open) => open && onTriggerOpen(idx)}>
          <DialogTrigger asChild className="cursor-pointer">
            <span className="relative cursor-pointer">
              <ImageWithLoader
                src={image as string}
                alt={`Property image ${idx + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Overlay on 6th image */}
              {remainingCount > 0 && idx === MAX_VISIBLE - 1 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-md z-10">
                  <span className="text-white text-lg font-semibold">
                    +{remainingCount}
                  </span>
                </div>
              )}
            </span>
          </DialogTrigger>

          <DialogContent
            overlayClassName="bg-black/95 z-[100]"
            className="bg-transparent border-none flex items-center flex-col justify-center w-full sm:max-w-3xl h-[70vh] p-0 m-0"
          >
            <DialogClose>
              <X className="text-white w-5" />
            </DialogClose>

            <Carousel
              setApi={setApi}
              className="w-full sm:max-w-[900px] aspect-[2/3] max-h-full sm:aspect-[3/2] flex flex-col gap-2 justify-between"
            >
              <CarouselContent>
                {/* Show ALL images in modal */}
                {images.map((image, index) => (
                  <CarouselItem key={index} className="h-[500px]">
                    <div className="p-0 h-full">
                      <img
                        src={image as string}
                        alt={`Property ${index + 1}`}
                        className="object-cover h-full w-full flex flex-grow"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              <div className="w-full flex items-center justify-center md:justify-between p-2">
                <div className="relative items-center gap-4 hidden md:flex">
                  <CarouselPrevious className="left-0 size-8 bg-transparent text-white" />
                  <CarouselNext className="left-12 size-8 bg-transparent text-white" />
                </div>

                <div className="flex justify-center space-x-2 mt-4">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      className={`w-2 h-[2px] rounded-full transition-all ${
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
  );
}

const ImageWithLoader = ({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) => {
  const [loading, setLoading] = useState(true);

  if (!src) {
    return <div className="bg-gray-300 rounded-lg w-full h-full" />;
  }

  return (
    <div className={`relative ${className} w-full h-full`}>
      {loading && (
        <Skeleton className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg" />
      )}

      <Image
        src={src}
        alt={alt}
        width={300}
        height={300}
        className={`object-cover w-full h-full rounded-lg aspect-[3/2] transition-opacity duration-300 ${
          loading ? "opacity-70" : "opacity-100"
        }`}
        loading="lazy"
        unoptimized
        onLoad={() => setLoading(false)}
      />
    </div>
  );
};