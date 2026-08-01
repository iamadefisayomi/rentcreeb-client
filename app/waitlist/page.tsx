"use client"

import { ArrowLeft, ArrowRight, Clock, Mail, MapPin, MoveLeft, Phone, Rocket, Star, Timer } from "lucide-react";
import dynamic from "next/dynamic";
import { ReactNode } from "react";
import LayoutWithImageHeader from "@/components/layoutWithImageHeader";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import WaitListForm from "@/sections/contact-us/WaitListForm";



export default function WaitList () {
  return (
    <LayoutWithImageHeader
        title="Join the RentCreeb 2.0 Waitlist"
        bgImage='/waitlist.png'
        component={
          <p className="text-white text-center">Secure early access before the public launch — be <br /> first in line when onboarding opens.</p>
        }
    >
      <div className=" w-full grow bg-[#f5f6fc]">
        <div className="w-full  max-w-8xl mx-auto md:flex-row md:gap-16 flex flex-col gap-6 px-4 py-8 md:py-32">
          <WaitListForm />
          <WaitListInfo />
        </div>
      </div>
    </LayoutWithImageHeader>
  );
}

const WaitListInfo = () => (
  <div className="flex flex-col items-start gap-2 h-fit  w-full rounded-3xl md:max-w-sm px-3 md:p-10 py-8 bg-gradient-to-b from-[#0b1f66] to-[#0E1028]">
    <div className="flex flex-col gap-4 items-start w-full mb-3">
        <Button className="flex items-center gap-3 text-primary p-0" variant='link'>
          <MoveLeft className="w-2"/>
          Back to home
        </Button>
        <h1 className="text-2xl capitalize font-bold text-center text-white">Why join early?</h1>
    </div>
    

    <div className="flex flex-col items-start w-full gap-4 pb-3">
      <WaitLink
        title="First access"
        icon={<Star className="size-5 text-white" />}
        text="Get on the platform before it opens to the public."
      />
      <WaitLink
        title="Priority onboarding"
        icon={<Clock className="size-5 text-white" />}
        text="Skip the queue and get set up before anyone else."
      />
      <WaitLink
        title="Shape the product"
        icon={<ArrowRight className="size-5 text-white" />}
        text="Early members help define what RentCreeb 2.0 becomes."
      />
      <WaitLink
        title="Launch benefits"
        icon={<Rocket className="size-5 text-white" />}
        text="Exclusive tiers and partner perks only for early sign-ups."
      />
    </div>

    <span className="text-gray-400 font-medium text-xs border-t border-muted-foreground pt-4">Thousands of landlords, renters, artisans and developers are already on the list.</span>
  </div>
);

const WaitLink = ({
  title,
  icon,
  text,
}: {
  title: string;
  icon: ReactNode;
  text: string;
}) => (
  <div
    title={title}
    className="flex items-center gap-3 w-full cursor-pointer hover:translate-x-3 duration-500"
  >
    <span className="size-11 aspect-square flex items-center bg-primary justify-center rounded-md">{icon}</span>
    <span className="flex flex-col items-start gap-1">
      <h2 className="text-[13px] font-semibold text-white">{title}</h2>
      <h3 className="text-[12px] lowercase text-gray-400">{text}</h3>
    </span>
  </div>
);