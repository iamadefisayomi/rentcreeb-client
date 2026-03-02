
import { _properties } from "@/_data/images";
import ExploreGallery from "@/sections/home/ExploreGallery";
import OurServices from "@/sections/ourServices";
import { HomeSearchBox } from "@/sections/SearchForms/HomeSearchBox";
import BaseLayout from "@/sections/layout";
import { Button } from "@/components/ui/button";
import Testimonials from "@/sections/testimonials";
import HowWeWork from "@/sections/OurWork";
import FeaturedProperties, { FeaturedPropertiesSkeleton } from "@/sections/property/featured";
import { Suspense } from "react";
import Image from "next/image";
import { getUserFavourites } from "@/actions/favourites";
import { getProperties } from "@/actions/properties";


export default async function Index() {

  const favourites = await (await getUserFavourites()).data
  const { properties } = await getProperties({limit: 6});

  return (
    <BaseLayout>
      <div className="relative py-20 min-h-[90vh] flex items-center justify-center">
        <Image
          src="/hero4.png"
          alt="Hero Background"
          fill
          priority
          className="object-cover"
        />
        <div className="relative z-10 w-full h-full flex flex-col items-center gap-8 max-w-8xl p-4">
          <div className="w-full flex items-center flex-col gap-2">
              <h2 className="text-7xl font-medium text-white text-center">Find Your Perfect <br /> Home with Ease</h2>
              <p className="text-sm font-[300] text-white text-center">Discover verified properties across Nigeria. <br /> Rent or buy safely with RentCreeb.</p>
          </div>
            <HomeSearchBox />
        </div>
      </div>

       <Suspense fallback={<FeaturedPropertiesSkeleton />}>
        <FeaturedProperties properties={properties} />
      </Suspense>
      <HowWeWork />
      <ExploreGallery />
      <OurServices />
      <Testimonials />
      <div className="w-full min-h-[50vh] bg-primary flex gap-4 items-center flex-col justify-center">
          <h2 className="text-white text-3xl text-center font-semibold">Ready to Find Your Next Home?</h2>
          <p className="text-white text-center">Join thousands of Nigerians who have found their perfect property through <br /> RentCreeb.</p>
          <Button variant='secondary' size='lg' className="text-primary">Explore Properties</Button>
      </div>
    </BaseLayout>
  );
}
