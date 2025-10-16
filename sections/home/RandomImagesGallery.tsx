"use client"

import { Button } from "@/components/ui/button"
import { generateRandomRadius } from "@/utils/generateRandomBorder"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"


type ImagesProps = {
    images: string[]
}
export default function RandomImagesGallery ({images}: ImagesProps) {
    const router = useRouter()
    return (
        <div className="w-full bg-white">
        <div className="w-full px-4 py-8 md:py-20 max-w-8xl mx-auto md:h-screen">
            <div className="w-full flex flex-col h-full md:flex-row-reverse md:items-center items-start gap-8 md:gap-20">
                <Gallery images={images} />
                <div className='flex flex-col items-start gap-3 max-w-md'>
                    <h4 className="text-primary uppercase text-xs font-medium">mervelous world</h4>
                    <h1 className="text-2xl md:text-4xl capitalize font-bold text-start">Image Speaks <br /> Volume: Explore the <br /> Our Gallery.</h1>
                    <p className="text-xs text-muted-foreground">Lorem ipsum dolor sit  molestiae delectus, iste velit ad quidem perferendis.</p>
                    <Button onClick={() => router.push("/gallery")} className="w-full max-w-[150px] text-xs md:h-12">
                        View all photo
                    </Button>
                </div>
            </div>
        </div>
        </div>
    )
}

const Gallery = ({ images }: ImagesProps) => {
  const [loading, setLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Generate random radius for each image once
  const borderRadii = useMemo(
    () => images.map(() => generateRandomRadius()),
    [images]
  );

  return (
    <div className="w-full h-full rounded-xl grid grid-cols-3 grid-rows-2 gap-2 md:gap-4">
      {/* Left Column */}
      <div className="grid grid-rows-2 row-span-2 gap-2 md:gap-4">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="rounded-xl overflow-hidden duration-500 ease-in-out"
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            style={{
              borderRadius:
                hoveredIndex === i ? borderRadii[i] : undefined,
            }}
          >
            <Image
              src={images[i]}
              alt={`Image ${i}`}
              width={300}
              height={300}
              className={`w-full h-full rounded-3xl object-cover hover:scale-105 duration-300 ${
                loading ? "opacity-70" : "opacity-100"
              }`}
              loading="lazy"
              unoptimized
              onLoad={() => setLoading(false)}
            />
          </div>
        ))}
      </div>

      {/* Middle Column */}
      <div
        className="grid row-span-2 overflow-hidden rounded-xl duration-500 ease-in-out"
        onMouseEnter={() => setHoveredIndex(2)}
        onMouseLeave={() => setHoveredIndex(null)}
        style={{
          borderRadius: hoveredIndex === 2 ? borderRadii[2] : undefined,
        }}
      >
        <Image
          src={images[2]}
          alt="Image 2"
          width={300}
          height={300}
          className={`w-full h-full rounded-3xl object-cover hover:scale-105 duration-300 ${
            loading ? "opacity-70" : "opacity-100"
          }`}
          loading="lazy"
          unoptimized
          onLoad={() => setLoading(false)}
        />
      </div>

      {/* Right Column */}
      <div className="grid grid-rows-2 row-span-2 gap-2 md:gap-4">
        {[3, 4].map((i) => (
          <div
            key={i}
            className="rounded-xl overflow-hidden duration-500 ease-in-out"
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            style={{
              borderRadius:
                hoveredIndex === i ? borderRadii[i] : undefined,
            }}
          >
            <Image
              src={images[i]}
              alt={`Image ${i}`}
              width={300}
              height={300}
              className={`w-full h-full rounded-3xl object-cover hover:scale-105 duration-300 ${
                loading ? "opacity-70" : "opacity-100"
              }`}
              loading="lazy"
              unoptimized
              onLoad={() => setLoading(false)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
