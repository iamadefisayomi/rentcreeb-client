"use client"

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { NewPropertySchemaType } from "@/sections/dashboard/formSchemas"
import SingleProperty from "@/sections/property/singleProperty"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import DropDownComp from "@/components/DropdownComp"
import { Button } from "@/components/ui/button"
import { Search, Trash2 } from "lucide-react"
import { _myPropertySort } from "@/_data/_propertyDefault"
import dayjs from "dayjs"
import Image from "next/image"
import currency from "currency.js"
import useAlert from "@/hooks/useAlert"
import { addToFavourites } from "@/actions/favourites"

export default function Favourites({
  favourites,
  role,
}: {
  favourites: (NewPropertySchemaType & {
    createdAt: string
    _id: string
    views: number
  })[]
  role: any
}) {
  const totalProperty = favourites?.length || 0
  const itemsPerPage = 6
  const totalPage = totalProperty <= itemsPerPage ? 1 : customDivision(totalProperty, itemsPerPage)

  const [page, setPage] = useState(1)
  const [sort, setSort] = useState("newest")
  const router = useRouter()
  const { setAlert } = useAlert()

  const nextPage = () => page < totalPage && setPage(page + 1)
  const prevPage = () => page > 1 && setPage(page - 1)

  const handleLoveClick = async (propertyId: string) => {
    if (!propertyId) return
    const { success } = await addToFavourites(propertyId)
    if (success) {
      setAlert("Removed from favourites", "success")
    }
  }

  const handleSortChange = (_sort: string) => setSort(_sort)

  const sortedFavourites = useMemo(() => {
    return [...favourites].sort((a, b) => {
      switch (sort) {
        case "newest":
          return dayjs(b.createdAt).unix() - dayjs(a.createdAt).unix()
        case "best seller":
          return (b.views || 0) - (a.views || 0)
        case "price low":
          return a.price - b.price
        case "price high":
          return b.price - a.price
        default:
          return 0
      }
    })
  }, [favourites, sort])

  const currentFavourites = useMemo(() => {
    const start = (page - 1) * itemsPerPage
    return sortedFavourites.slice(start, start + itemsPerPage)
  }, [sortedFavourites, page])

  return (
    <div className="w-full flex flex-col">
      <h2 className="text-xs font-semibold capitalize pb-4">favourites</h2>

      {role === "agent" ? (
        <div className="border rounded-lg min-h-[400px] flex flex-col">
          <div className="w-full flex items-center justify-between p-2">
            <p className="text-[11px] text-muted-foreground">
              You have <span className="font-bold">{totalProperty}</span> properties in your favourite list
            </p>

            <div className="flex items-center gap-2">
              <p className="text-[11px] font-medium capitalize">sort by:</p>
              <DropDownComp
                title={sort}
                className="w-fit gap-2 border text-[11px]"
                component={
                  <div className="flex w-[100px] flex-col gap-2">
                    {Object.entries(_myPropertySort).map(([key, value], index) => (
                      <Button
                        key={index}
                        onClick={() => handleSortChange(value.value)}
                        className="text-[11px] w-full capitalize"
                        variant="ghost"
                      >
                        {value.label}
                      </Button>
                    ))}
                  </div>
                }
              />
              <Button variant="ghost" className="rounded-[8px] w-8 h-8 bg-muted" size="icon">
                <Search className="w-4" />
              </Button>
            </div>
          </div>

          <div className="flex-grow">
            <Table>
              <TableHeader className="border-y bg-slate-100">
                <TableRow className="py-10 h-14">
                  <TableHead className="w-[300px] text-[11px] capitalize text-slate-800 font-semibold">listing</TableHead>
                  <TableHead className="text-[11px] text-center capitalize text-slate-800 font-semibold">date published</TableHead>
                  <TableHead className="text-[11px] text-center capitalize text-slate-800 font-semibold">view</TableHead>
                  <TableHead className="text-center text-[11px] capitalize text-slate-800 font-semibold">action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentFavourites.map((pro, index) => (
                  <TableRow key={index}>
                    <TableCell
                      className="flex items-start gap-2 cursor-pointer"
                      onClick={() => router.push(`/property/${pro?._id}`)}
                    >
                      <Image
                        src={(pro.images[0] as string) || ""}
                        alt={`Property Image ${index + 1}`}
                        width={300}
                        height={300}
                        className="w-full max-w-28 aspect-[3/2] rounded-md object-cover"
                        loading="lazy"
                        unoptimized
                      />
                      <div className="flex flex-col gap-1 items-start">
                        <h4 className="text-[11px] font-semibold capitalize text-gray-600 truncate max-w-[200px]">{pro.title}</h4>
                        <h4 className="text-[11px] font-medium text-muted-foreground truncate max-w-[200px]">{pro.address}</h4>
                        <h4 className="text-[11px] font-semibold text-gray-700">
                          {currency(pro?.price, { symbol: "₦", precision: 2 }).format()}
                        </h4>
                      </div>
                    </TableCell>

                    <TableCell className="text-center text-[11px]">
                      {pro?.createdAt ? dayjs(pro?.createdAt).format("DD MMM, YYYY") : "-"}
                    </TableCell>

                    <TableCell className="text-center text-[11px]">{pro?.views || 0}</TableCell>

                    <TableCell>
                      <div className="h-fit p-0 border-none shadow-none flex items-center justify-center bg-transparent">
                        <Button
                          onClick={() => handleLoveClick(pro._id)}
                          variant="ghost"
                          size="sm"
                          className="self-center flex items-center gap-1 text-[11px] bg-slate-100 hover:bg-slate-200"
                        >
                          <Trash2 className="w-3" /> Remove
                        </Button>
                      </div>
                      
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="border-t p-2 flex items-center justify-end">
            <PaginationNav
              currectPage={page}
              totalPage={totalPage}
              prevPage={prevPage}
              nextPage={nextPage}
            />
          </div>
        </div>
      ) : (
        <div className="w-full flex flex-col">
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-2 min-h-[400px] flex-grow">
            {currentFavourites.map((fav, index) => (
              <SingleProperty property={fav as any} key={index} />
            ))}
          </div>

          <div className="w-full flex items-center justify-end border rounded-lg p-2 mt-6">
            <PaginationNav
              currectPage={page}
              totalPage={totalPage}
              prevPage={prevPage}
              nextPage={nextPage}
            />
          </div>
        </div>
      )}
    </div>
  )
}

function PaginationNav({
  nextPage,
  prevPage,
  currectPage,
  totalPage,
}: {
  nextPage: any
  prevPage: any
  currectPage: number
  totalPage: number
}) {
  return (
    <Pagination className="w-fit">
      <PaginationContent className="w-fit">
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
          <PaginationLink href="#">{totalPage}</PaginationLink>
        </PaginationItem>

        <PaginationItem>
          <PaginationNext onClick={nextPage} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

function customDivision(dividend: number, divisor: number) {
  const remainder = dividend % divisor
  return remainder === 0 ? dividend / divisor : Math.floor(dividend / divisor) + 1
}
