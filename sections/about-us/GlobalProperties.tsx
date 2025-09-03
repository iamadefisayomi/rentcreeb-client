"use client"

import { _properties } from "@/_data/images";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";


export default function GlobalProperties () {

    return (
        <div className="w-full bg-white items-center flex justify-center min-h-[70vh] px-4">
        <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 place-items-start max-w-8xl md:py-20 py-10 gap-10">
            <span
                style={{ backgroundImage: `url(${_properties[0].image})` }}
                className="w-full h-[500px] bg-contain bg-center mask1 "
            />

            <div className="w-full flex flex-col items-start justify-between h-full gap-4">
                <div className="w-full flex flex-col gap-2 border-b pb-2 md:pb-10">
                    <h3 className="text-xs font-medium uppercase text-primary text-start">global properties</h3>
                    <h1 className="text-2xl capitalize font-bold text-slate-900 text-start">Welcome to Our Properties <br /> with all the Convenience</h1>
                    <p className="text-xs text-start text-muted-foreground">Find the perfect home with thoughtfully designed spaces, modern amenities, and prime locations. Whether you're searching for a cozy retreat or a luxurious estate, our collection of properties offers unparalleled convenience, elegance, and accessibility to suit your lifestyle.
                    </p>
                </div>

                <div className="grid grid-cols-3 w-full gap-4 md:gap-6 py-4">
                    <Statcard label='10k' details='satisfied customers' />
                    <Statcard label='8+' details='years of experience' />
                    <Statcard label='200k' details='established housing' />
                </div>

                <div className="flex items-start flex-col gap-8 w-full md:flex-row">
                    <Button className="text-xs w-full max-w-md md:max-w-[250px] h-11 ">Explore Properties</Button>

                    <Link
                        href="tel:+234-812-345-6789"
                        className="flex items-center gap-3"
                        >
                        <span className="w-8 h-8 flex items-center justify-center border rounded-full border-primary">
                            <Phone className="w-4 h-4"/>
                        </span>
                        <span className="flex flex-col items-start gap-1">
                            <h2 className="text-xs font-semibold capitalize">call us anytime</h2>
                            <h3 className="text-[11px] lowercase text-muted-foreground">+234-812-345-6789</h3>
                        </span>
                    </Link>
                </div>
            </div>
        </div>
        </div>
    )
}

const Statcard = ({label, details}: {label: string, details: string}) => {
    return (
        <div className="flex flex-col items-center justify-center cursor-default w-full p-3 md:aspect-auto md:py-6 aspect-square gap-1 rounded-xl bg-slate-200">
            <h1 className="text-2xl md:text-5xl font-bold uppercase">{label}</h1>
            <p className="text-[10px] md:text-xs capitalize text-muted-foreground text-center">{details}</p>
        </div>
    )
}