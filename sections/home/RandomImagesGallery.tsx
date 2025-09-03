"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"


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
    return (
       <div className="w-full h-full rounded-xl grid grid-cols-3 grid-rows-2 gap-2 md:gap-4">
            <div className="grid grid-rows-2 row-span-2 gap-2 md:gap-4">
                <div className="rounded-xl overflow-hidden">
                    <Image
                        src={images[0]}
                        alt={`Image 0`}
                        width={300}
                        height={300}
                        className={`w-full h-full rounded-lg object-cover hover:scale-105 duration-300 ${
                            loading ? "opacity-70" : "opacity-100"
                        }`}
                        loading="lazy"
                        unoptimized
                        onLoad={() => setLoading(false)}
                    />
                </div>
                <div className="rounded-xl overflow-hidden">
                    <Image
                        src={images[1]}
                        alt={`Image 1`}
                        width={300}
                        height={300}
                        className={`w-full h-full rounded-lg object-cover hover:scale-105 duration-300 ${
                            loading ? "opacity-70" : "opacity-100"
                        }`}
                        loading="lazy"
                        unoptimized
                        onLoad={() => setLoading(false)}
                    />
                </div>
            </div>
            <div className="grid row-span-2 overflow-hidden rounded-xl">
                <Image
                    src={images[2]}
                    alt={`Image 2`}
                    width={300}
                    height={300}
                    className={`w-full h-full rounded-lg object-cover hover:scale-105 duration-300 ${
                        loading ? "opacity-70" : "opacity-100"
                    }`}
                    loading="lazy"
                    unoptimized
                    onLoad={() => setLoading(false)}
                />
            </div>
            <div className="grid grid-rows-2 row-span-2 gap-2 md:gap-4">
                <div className="rounded-xl overflow-hidden">
                    <Image
                        src={images[3]}
                        alt={`Image 3`}
                        width={300}
                        height={300}
                        className={`w-full h-full rounded-lg object-cover hover:scale-105 duration-300 ${
                            loading ? "opacity-70" : "opacity-100"
                        }`}
                        loading="lazy"
                        unoptimized
                        onLoad={() => setLoading(false)}
                    />
                </div>
                <div className="rounded-xl overflow-hidden">
                    <Image
                        src={images[4]}
                        alt={`Image 4`}
                        width={300}
                        height={300}
                        className={`w-full h-full rounded-lg object-cover hover:scale-105 duration-300 ${
                            loading ? "opacity-70" : "opacity-100"
                        }`}
                        loading="lazy"
                        unoptimized
                        onLoad={() => setLoading(false)}
                    />
                </div>
            </div>
       </div>
    );
  };
