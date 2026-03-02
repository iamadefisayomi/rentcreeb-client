"use client"

import {Linkedin} from "lucide-react";
import { _teams } from "./_teams";
import Link from "next/link";

export default function Team () {
    return (
        <div className="w-full bg-white" id="our-team">
        <div className="w-full px-4 py-8 md:py-20 max-w-8xl mx-auto flex flex-col gap-12 items-center">
            <div className='flex flex-col items-center gap-3 max-w-md '>
                <h4 className="text-primary uppercase text-xs font-medium">property partners</h4>
                <h1 className="text-2xl md:text-4xl capitalize font-semibold text-start">meet the team</h1>
            </div>

            <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-10">
                {
                    _teams.map((team: any, index: number) => (
                        <TeamCard
                            key={index}
                            image={team.image}
                            role={team.role}
                            name={team.name}
                            linkedin={team.linkedin}
                        />
                    ))
                }
            </div>
        </div>
        </div>
    )
}

type TeamCardProps = {
  image: string;
  name: string;
  role: string;
  linkedin: string;
};

const TeamCard = ({ image, name, role, linkedin }: TeamCardProps) => {
  return (
    <div className="w-full flex flex-col items-center gap-2 group">
        <div className="relative w-full aspect-square overflow-visible bg-white rounded-full flex items-end justify-center">
          <div className="w-[70%] h-full absolute bottom-0 left-1/2 overflow-hidden -translate-x-1/2 bg-transparent rounded-full">
            <img 
                src={image} 
                alt={name} 
                className="w-full h-full object-cover rounded-b-full group-hover:animate-shake"
              />
          </div>
          <div className="size-[70%] bg-primary rounded-full group-hover:h-full group-hover:bg-gray-300 duration-500"/>

          <Link href={linkedin} target="_blank" className="size-12 rounded-full bg-gray-300 border-4 border-white absolute right-8 bottom-0 flex items-center justify-center">
            <Linkedin className="size-5 text-primary" />
          </Link>
        </div>

        <div className="w-full flex flex-col items-center">
          <h2 className="text-xs capitalize font-medium text-muted-foreground">{role}</h2>
          <h2 className="text-[13.5px] capitalize font-semibold text-slate-700">{name}</h2>
        </div>
    </div>
  );
};




  