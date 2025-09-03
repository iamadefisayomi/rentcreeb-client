"use client"

import {  _properties, _reviewsSort } from "@/_data/images"
import DropDownComp from "@/components/DropdownComp"
import { Button } from "@/components/ui/button"
import { Flag, Reply, Search, ThumbsUp } from "lucide-react"
import { useState } from "react"
import { CalendarIcon } from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import Rating from "@/components/Rating"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/useAuth"




export default function Reviews ({title, reviews}: {title: string, reviews: any[]}) {
    const [sort, setSort] = useState('newest')
    const totalPage = reviews && reviews.length <= 6 ? 1 : customDivision(reviews.length, 6)
    const [page, setPage] = useState(1)
    const nextPage = () => page < totalPage && setPage(page+1)
    const prevPage = () => page > 1 && setPage(page - 1)

    return (
        <div className="w-full flex flex-col">
            <h2 className="text-xs font-semibold capitalize pb-4">{title}</h2>

            <div className="border rounded-lg min-h-[400px] flex flex-col">
                <div className="w-full flex flex-col md:flex-row items-start gap-4 md:gap-2 md:items-center justify-between p-4 md:p-2 border-b">
                    <p className="text-[11px] text-muted-foreground">
                        Showing <span className="font-bold">{`${1} - ${5}`}</span> of <span className="font-bold">{20}</span> results 
                    </p>

                    <div className="flex items-center gap-2">
                        <p className="text-[11px] font-medium capitalize">sort by:</p>
                        <DropDownComp 
                            title={sort}
                            className="w-fit gap-2 border text-[11px]" 
                            component={
                                    <div className="flex w-[100px] flex-col gap-2">
                                    {
                                            _reviewsSort.map((_sort, index) => (
                                            <Button key={index} onClick={() => setSort(_sort)} className="text-[11px] w-full capitalize" variant='ghost'>
                                                {_sort}
                                            </Button>
                                        ))
                                    }
                                    </div>
                            }
                        />
                        <Button variant="ghost" className="rounded-[8px] w-8 h-8 bg-muted" size='icon'>
                            <Search className="w-4"/>
                        </Button>
                    </div>
                </div>

                <div className="w-full flex flex-col ">
                    {
                        Array.from({length: 5}).map((review, index) => (
                            <div key={index} className="border-b p-4">
                                <SingleReview />
                            </div>
                        ))
                    }
                </div>

                <div className=" p-2 flex items-center justify-end">
                    <PaginationNav currectPage={page} totalPage={totalPage} prevPage={prevPage} nextPage={nextPage} />
                </div>
            </div>
        </div>
    )
}




function SingleReview () {
    const {user} = useAuth()
    const avatarFallback = user?.name?.slice(0, 2) || user?.email?.slice(0, 2) || "G";
  return (
    <div className="w-full flex flex-col md:flex-row items-start gap-2">
        <HoverCard>
            <HoverCardTrigger asChild>
                <Avatar className="w-10 h-10 bg-slate-100 cursor-pointer">
                <AvatarImage
                    src={user?.image || ""}
                    className="w-full h-full object-cover rounded-full"
                    alt="User Avatar"
                />
                <AvatarFallback className="uppercase text-sm">{avatarFallback}</AvatarFallback>
                </Avatar>
            </HoverCardTrigger>
            <HoverCardContent className="w-fit p-4">
                <div className="flex flex-col items-center gap-2">
                <Avatar className="w-8 h-8 border border-primary p-1 bg-slate-100 cursor-pointer" >
                <AvatarImage
                    src={user?.image || ""}
                    className="w-full h-full object-cover rounded-full"
                    alt="User Avatar"
                />
                <AvatarFallback className="uppercase text-sm">{avatarFallback}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-center gap-1">
                    <h4 className="text-[11px] font-semibold">{user?.name}</h4>
                    <p className="text-[10px] text-muted-foreground">{user?.email}</p>
                    <div className="flex items-center pt-2">
                    <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />{" "}
                    <span className="text-[10px] font-semibold text-muted-foreground">
                        Joined December 2021
                    </span>
                    </div>
                </div>
                </div>
            </HoverCardContent>
        </HoverCard>

        {/* -------- */}
        <div className="w-full flex flex-col gap-3">
            <div className="w-full flex items-center justify-between gap-2">
                <div className="flex flex-col items-start gap-1">
                    <h2 className="text-xs capitalize font-bold">james kalin</h2>
                    <p className="text-[11px] text-gray-600 capitalize">jan 23 2025</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-md font-semibold text-gray-600 ">4.8</span>
                    <Rating length={5} className="text-primary fill-current" />
                </div>
            </div>

            <p className="text-xs text-gray-700">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Maiores inventore aspernatur praesentium libero odio nisi ducimus sit quasi iste laudantium.</p>

            <div className="grid grid-cols-4 gap-2 md:w-1/2 w-full my-1">
            {
                _properties.slice(0, 4).map((pro, index) => (
                    <span key={index} className="relative rounded-md">
                        <img
                            src={pro.image}
                            alt=""
                            className={cn("object-cover w-full h-full rounded-md aspect-square")}
                        />
                        {_properties.length > 4 && index === 3 && <div className="absolute inset-0 bg-black rounded-md opacity-50 z-0"/>}
                        {_properties.length > 4 && index === 3 && (
                            <p className="absolute inset-0 flex items-center justify-center text-white text-xs font-medium">
                            {_properties.length}+
                            </p>
                        )}
                    </span>
                ))
            }
            </div>

            <div className="flex items-center gap-2">
                <Button className="capitalize text-gray-600 text-[11px] flex items-center gap-2" variant='ghost' >
                    <ThumbsUp className="w-4" />
                    Helpful
                </Button>
                <Button className="capitalize text-gray-600 text-[11px] flex items-center gap-2" variant='ghost' >
                    <Flag className="w-4" />
                    flag
                </Button>
                <Button className="capitalize text-gray-600 text-[11px] flex items-center gap-2" variant='ghost' >
                    <Reply className="w-4" />
                    reply
                </Button>
            </div>
        </div>

    </div>
  )
}

  
function PaginationNav ({nextPage, prevPage, currectPage, totalPage}: {nextPage: any, prevPage: any, currectPage: number, totalPage: number}) {

    return (
      <Pagination className="w-fit ">
        <PaginationContent className=" w-fit">

          <PaginationItem>
            <PaginationPrevious onClick={prevPage} />
          </PaginationItem>

          <PaginationItem>
          <PaginationLink href="#" isActive>
            {currectPage}
          </PaginationLink>
        </PaginationItem>

        <span className="text-[10px] lowercase text-muted-foreground font-medium mx-1">of</span>

        <PaginationItem>
          <PaginationLink href="#">
            {totalPage}
          </PaginationLink>
        </PaginationItem>

          <PaginationItem>
            <PaginationNext onClick={nextPage}/>
          </PaginationItem>

        </PaginationContent>
      </Pagination>
    )
  }


function customDivision(dividend: number, divisor: number) {
    const remainder = dividend % divisor;
    return remainder === 0 ? dividend / divisor : Math.floor(dividend / divisor) + 1;
  }