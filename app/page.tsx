
import BaseLayout from "@/sections/layout";
import ExploreGallery from "@/sections/home/ExploreGallery";
import OurServices from "@/sections/ourServices";
import Testimonials from "@/sections/testimonials";
import HowWeWork from "@/sections/OurWork";
import JoinUsItem from "@/sections/JoinWaitList";

import FeaturedProperties, {
  FeaturedPropertiesSkeleton,
} from "@/sections/property/featured";

import ExploreProperties, {
  ExplorePropertiesSkeleton,
} from "@/sections/property/ExploreProperties";

import { HomeSearchBox2 } from "@/sections/SearchForms/HomeSearchBox2";
import { getUserFavourites } from "@/actions/favourites";
import {
  getProperties,
  getExploreProperties,
} from "@/actions/properties";

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";
import { Noto_Serif } from "next/font/google";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";

const notoSerif = Noto_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const propUsers = [
  "https://images.unsplash.com/photo-1566165335512-bb5ba58365b4?q=80&w=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1585532487868-ae1ab18246d0?q=80&w=687&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1624605327959-6986705cb194?q=80&w=687&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1773592617583-6c56c05a9239?q=80&w=687&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1678737210578-eaf634c8d342?q=80&w=687&auto=format&fit=crop",
];

export default async function Index() {
  // Fetch featured properties and favourites concurrently.
  const [favouritesResult, featuredResult] = await Promise.all([
    getUserFavourites(),
    getProperties({ limit: 4 }),
  ]);

  const favourites = favouritesResult?.data ?? [];
  const featuredProperties = featuredResult?.properties ?? [];

  // Exclude featured property IDs from the Explore section.
  const featuredIds = featuredProperties.map((property: any) =>
    String(property._id)
  );

  const exploreResult = await getExploreProperties(featuredIds, 4);
  const exploreProperties = exploreResult?.properties ?? [];

  return (
    <BaseLayout>
      {/* Hero Section */}
      <section className="relative py-20 min-h-[90vh] flex items-center justify-center">
        <Image
          src="/hero6.svg"
          alt="RentCreeb property search"
          fill
          priority
          className="object-cover"
        />

        <div className="relative z-10 py-8 flex flex-col p-6 md:p-0 md:grid grid-cols-4 md:gap-4 gap-8 mx-auto w-full max-w-8xl">
          <div className="col-span-3 flex flex-col items-start justify-between md:gap-4 gap-10">
            <div className="flex flex-col gap-4">
              <h1
                className={`${notoSerif.className} text-5xl md:text-7xl font-medium text-white capitalize leading-tight`}
              >
                Find your perfect
                <br />
                home with ease
              </h1>

              <p className="text-sm font-light text-white">
                Discover verified properties across Nigeria.
                <br />
                Rent or buy safely with RentCreeb.
              </p>
            </div>

            <div className="flex flex-col items-start gap-1">
              <p className="text-[10px] font-light text-white">
                Trusted by property teams
              </p>

              <div className="flex items-center gap-2">
                <AvatarGroup>
                  {propUsers.map((user, index) => (
                    <Avatar key={index}>
                      <AvatarImage
                        className="object-cover rounded-full"
                        src={user}
                        alt="Property professional"
                      />
                      <AvatarFallback>RC</AvatarFallback>
                    </Avatar>
                  ))}
                </AvatarGroup>

                <p className="text-[10.5px] text-white">
                  Used by 60+
                  <br />
                  developers and builders
                </p>
              </div>
            </div>
          </div>

          <div className="col-span-1">
            <HomeSearchBox2 />
          </div>
        </div>
      </section>

      {/* Explore Properties */}
      <Suspense fallback={<ExplorePropertiesSkeleton />}>
        <ExploreProperties properties={exploreProperties} />
      </Suspense>

      {/* Join Waitlist */}
      <JoinUsItem />

      {/* Explore Gallery */}
      <ExploreGallery />

      {/* Our Services */}
      <OurServices />

      {/* Featured Properties */}
      <Suspense fallback={<FeaturedPropertiesSkeleton />}>
        <FeaturedProperties properties={featuredProperties} />
      </Suspense>

      {/* How RentCreeb Works */}
      <HowWeWork />

      {/* Testimonials */}
      <Testimonials />

      {/* Final Call to Action */}
      <section className="w-full bg-primary flex items-center justify-center p-6 md:p-20">
        <div className="group w-full relative md:max-w-[60%] flex items-center bg-slate-950 rounded-3xl min-h-[50vh] overflow-hidden p-8 md:p-16">
          <div className="relative z-10 flex flex-col items-start gap-3">
            <h2 className="text-white text-[28px] font-semibold">
              Ready to be part of
              <br />
              <span className="text-primary">RentCreeb 2.0?</span>
            </h2>

            <p className="text-muted font-light text-xs">
              Thousands of landlords, renters, artisans
              <br />
              and developers are already preparing.
              <br />
              Don&apos;t miss your spot.
            </p>

            <Link href="/waitlist">
              <Button
                variant="secondary"
                size="lg"
                className="text-primary mt-2 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/30"
              >
                Join The Waitlist
                <ArrowRight className="text-primary size-3 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          <img
            src="/readySVG.svg"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute -right-8 -bottom-10 w-[55%] opacity-80 transition-all duration-700 ease-out group-hover:scale-110 group-hover:-translate-x-3 group-hover:-translate-y-3 group-hover:opacity-100"
          />
        </div>
      </section>
    </BaseLayout>
  );
}
