"use client"

import { Button } from "@/components/ui/button";
import { HomeSearchBox } from "../SearchForms/HomeSearchBox";



export default function HeroSection () {

    return (
        <div className="w-full h-[90vh] pt-5 relative">
            <div className='w-full h-full max-w-7xl mx-auto flex flex-col items-start justify-evenly '>
                <div />

                <div className='flex flex-col items-start gap-2 max-w-lg'>
                    <h1 className="text-2xl font-normal">Your Home Search <span className="text-primary font-bold">Journey Ends</span>  <br />
                    and <span className="text-primary font-bold">Adventure Begins</span> here</h1>
                    <p className='text-xs'>Welcome to the future of hassle-free living in Lagos!. Experience 
                    the true essence of Lagos living, minus the traditional agent wahala.</p>
                    <Button variant='ghost' className="rounded-3xl text-[10px] h-6 font-semibold px-4 hover:bg-primary dark:text-black hover:text-white bg-blue-200">Why Us?</Button>
                </div>

                <div className="w-full">
                    <HomeSearchBox />
                </div>
            </div>
        </div>
    )
}