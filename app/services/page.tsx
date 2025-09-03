"use client"

import React from "react";
import { Home, User, Video, Gavel, MapPin, Headphones } from "lucide-react";
import LayoutWithImageHeader from "@/components/layoutWithImageHeader";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Routes from "@/Routes";

const services = [
  {
    icon: <Home className="text-blue-600 w-10 h-10" />, 
    title: "Property Listings",
    description: "Browse rental properties with detailed listings, including high-quality images, pricing, and essential information to help you make informed decisions.",
  },
  {
    icon: <User className="text-green-600 w-10 h-10" />, 
    title: "Agent Connect",
    description: "Find and connect with verified real estate agents who can assist you in finding the right home based on your preferences and budget.",
  },
  {
    icon: <Video className="text-purple-600 w-10 h-10" />, 
    title: "Virtual Tours",
    description: "Experience properties from the comfort of your home with immersive 360° virtual tours, allowing you to explore every detail before visiting in person.",
  },
  {
    icon: <Gavel className="text-red-600 w-10 h-10" />, 
    title: "Legal Advisory",
    description: "Get professional guidance on rental agreements, tenant rights, and legal documentation to ensure a smooth and hassle-free rental experience.",
  },
  {
    icon: <MapPin className="text-yellow-600 w-10 h-10" />, 
    title: "Neighborhood Insights",
    description: "Gain valuable insights into neighborhoods, including safety ratings, nearby schools, shopping centers, public transport access, and local amenities.",
  },
  {
    icon: <Headphones className="text-indigo-600 w-10 h-10" />, 
    title: "User Support",
    description: "Our dedicated support team is available 24/7 to assist you with inquiries, troubleshooting, and any guidance you need throughout your rental journey.",
  },
];

export default function Page () {
  return (
    <LayoutWithImageHeader
        title="Our Services"
        bgImage="https://images.pexels.com/photos/4101143/pexels-photo-4101143.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      >
      <div className="w-full ">
      <div className="container mx-auto p-6 max-w-7xl ">
        <h1 className="scroll-m-20 text-2xl text-primary font-extrabold my-4 tracking-tight lg:text-3xl">
          Services
        </h1>
        <p className="text-left font-semibold text-md mb-8 max-w-2xl ">
          At RentCreeb Inc., we strive to make your rental journey seamless and stress-free. Discover our range of services tailored to assist you in finding the perfect home.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white p-8 rounded-lg shadow-lg text-center hover:shadow-xl transition duration-300">
              <div className="mb-4 flex justify-center">{service.icon}</div>
              <h2 className="text-sm uppercase font-bold mb-3 text-gray-800">{service.title}</h2>
              <p className="text-muted-foreground font-medium leading-relaxed text-[13px]">{service.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center w-full flex flex-col gap-4">
          <p className="text-sm font-medium text-gray-700">Ready to find your dream rental home?</p>
            <Link className="w-full" href={Routes.contact}><Button size='lg' variant='link' className="max-w-sm w-full">Get Started</Button></Link>
        </div>
      </div>
      </div>
    </LayoutWithImageHeader>
  );
};
