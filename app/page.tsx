
import { _properties } from "@/_data/images";
import ExploreGallery from "@/sections/home/ExploreGallery";
import OurServices from "@/sections/ourServices";
import BaseLayout from "@/sections/layout";
import { Button } from "@/components/ui/button";
import Testimonials from "@/sections/testimonials";
import HowWeWork from "@/sections/OurWork";
import FeaturedProperties, { FeaturedPropertiesSkeleton } from "@/sections/property/featured";
import { Suspense } from "react";
import Image from "next/image";
import { getUserFavourites } from "@/actions/favourites";
import { getProperties } from "@/actions/properties";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/components/ui/avatar"
import { HomeSearchBox2 } from "@/sections/SearchForms/HomeSearchBox2";
import { Noto_Serif } from "next/font/google";

const notoSerif = Noto_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const propUsers = [
  "https://images.unsplash.com/photo-1566165335512-bb5ba58365b4?q=80&w=710&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1585532487868-ae1ab18246d0?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1624605327959-6986705cb194?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1773592617583-6c56c05a9239?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1678737210578-eaf634c8d342?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
];


export default async function Index() {

  const favourites = await (await getUserFavourites()).data
  const { properties } = await getProperties({limit: 6});

  return (
    <BaseLayout>
      <div className="relative py-20 min-h-[90vh] flex items-center justify-center">
        <Image
          src="/hero6.svg"
          alt="Hero Background"
          fill
          priority
          className="object-cover"
        />

        <div className="z-10 py-8 grid grid-cols-4 gap-4 mx-auto w-full max-w-8xl">
          <div className="col-span-3 flex flex-col items-start justify-between">

            <div className="flex flex-col gap-4 ">
                <p
                  className={`${notoSerif.className} text-7xl font-medium text-white capitalize leading-tight`}
                >
                  Find your perfect <br />
                  home with ease
                </p>
                <p className="text-sm font-light text-white">Discover verified properties across Nigeria. <br /> Rent or buy safely with RentCreeb.</p>
            </div>

              <div className="flex flex-col items-start gap-1">
                <p className="text-[10px] font-light text-white">Trusted by property teams</p>
                <div className="flex items-center gap-2">
                  <AvatarGroup>
                    {
                      propUsers.map((user, index) => (
                        <Avatar key={index}>
                          <AvatarImage className="object-cover rounded-full flex" src={user} alt="prop-user" />
                          <AvatarFallback>RC</AvatarFallback>
                        </Avatar>
                      ))
                    }
                  </AvatarGroup>
                  <p className="text-[10.5px] text-white">Used by 60+ <br /> developer & builders </p>
                </div>
              </div>
          </div>

          <div className="col-span-1">
              <HomeSearchBox2 />
          </div>
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
