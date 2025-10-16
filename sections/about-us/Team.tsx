import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button"



export default function Team () {

    return (
        <div className="w-full bg-white">
        <div className="w-full px-4 py-8 md:py-20 max-w-8xl mx-auto flex flex-col gap-12 items-center">
            <div className='flex flex-col items-center gap-3 max-w-md '>
                <h4 className="text-primary uppercase text-xs font-medium">property partners</h4>
                <h1 className="text-2xl md:text-4xl capitalize font-semibold text-start">meet the team</h1>
            </div>

            <div className="w-full grid grid-cols-1 md:grid-cols-5 sm:grid-cols-2 gap-6">
                {
                    _teams.map((team, index) => (
                        <TeamCard 
                            key={index}
                            image={team.image}
                            role={team.role}
                            name={team.name}
                        />
                    ))
                }
            </div>
        </div>
        </div>
    )
}

const TeamCard = ({ image, role, name }: {image: string, name: string, role: string}) => {
    return (
       <div className="w-full p-1 flex flex-col border border-primary/50 gap-3 hover:scale-105 rounded-2xl pb-6 duration-300">
           <img src={image} alt={name} className="rounded-2xl aspect-square object-cover flex  " />
           <div className="w-full flex items-center flex-col gap-1">
                <p className="capitalize font-medium text-xs">{name}</p>
                <p className="capitalize text-[10px] text-muted-foreground">{role}</p>
           </div>

           <div className="flex items-center gap-2 w-full justify-center">
            <Button size='icon'>
              <Facebook className="w-5"  />
            </Button>
            <Button size='icon'>
              <Twitter className="w-5"  />
            </Button>
            <Button size='icon'>
              <Instagram className="w-5"  />
            </Button>
            <Button size='icon'>
              <Linkedin className="w-5"  />
            </Button>
        </div>
       </div>
    );
  };


  const _teams = [
    {
      id: 1,
      name: "Olaniyi Seyi",
      role: "Public Relation",
      image: "https://firebasestorage.googleapis.com/v0/b/rent-house-a2c71.appspot.com/o/team%2FScreenshot%20(36).png?alt=media&token=60229562-8a70-4149-8678-d2154bb7989a",
    },
    {
      id: 2,
      name: "Kazeem",
      role: "Head of Design",
      image: "https://ik.imagekit.io/rentcreeb/kazeem.jpg?updatedAt=1760441997865",
    },
    {
      id: 3,
      name: "chucks",
      role: "Quality Assurance",
      image: "https://firebasestorage.googleapis.com/v0/b/rent-house-a2c71.appspot.com/o/team%2FScreenshot%20(41).png?alt=media&token=0b81a629-fdd3-4012-8eb4-d65945b47c55",
    },
    {
      id: 4,
      name: "Wale Fatoke",
      role: "Chief operating officer",
      image: "https://firebasestorage.googleapis.com/v0/b/rent-house-a2c71.appspot.com/o/team%2FScreenshot%20(35).png?alt=media&token=67d82f8c-e3b7-4342-a652-2606edc66804",
    },
    {
      id: 5,
      name: "Abigail Ekpeyoung",
      role: "Product manager",
      image: "https://ik.imagekit.io/rentcreeb/abi.jpg?updatedAt=1760441998189",
    },
  ];
  