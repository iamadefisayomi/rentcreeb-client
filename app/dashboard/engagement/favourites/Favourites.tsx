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
import PropertyLayout from "@/sections/property/propertyLayout"

type FavouriteType = NewPropertySchemaType & {
  createdAt?: string
  _id: string
  views?: number
  images?: string[]
}

export default function Favourites({
  favourites,
  role,
}: {
  favourites?: FavouriteType[]
  role: any
}) {
  const safeFavourites = Array.isArray(favourites) ? favourites : []

  const totalProperty = safeFavourites.length
  const itemsPerPage = 6
  const totalPage =
    totalProperty <= itemsPerPage
      ? 1
      : customDivision(totalProperty, itemsPerPage)

  const [page, setPage] = useState(1)
  const [sort, setSort] = useState("newest")
  const router = useRouter()
  const { setAlert } = useAlert()

  const nextPage = () => page < totalPage && setPage(p => p + 1)
  const prevPage = () => page > 1 && setPage(p => p - 1)

  const handleLoveClick = async (propertyId: string) => {
    if (!propertyId) return
    const { success } = await addToFavourites(propertyId)
    if (success) {
      setAlert("Removed from favourites", "success")
    }
  }

  const sortedFavourites = useMemo(() => {
    return [...safeFavourites].sort((a, b) => {
      switch (sort) {
        case "newest":
          return (
            dayjs(b.createdAt || 0).unix() -
            dayjs(a.createdAt || 0).unix()
          )
        case "best seller":
          return (b.views || 0) - (a.views || 0)
        case "price low":
          return (a.price || 0) - (b.price || 0)
        case "price high":
          return (b.price || 0) - (a.price || 0)
        default:
          return 0
      }
    })
  }, [safeFavourites, sort])

  const currentFavourites = useMemo(() => {
    const start = (page - 1) * itemsPerPage
    return sortedFavourites.slice(start, start + itemsPerPage)
  }, [sortedFavourites, page])

  return (
    <div className="w-full flex flex-col">
      <h2 className="text-xs font-semibold capitalize pb-4">
        favourites
      </h2>

      {role === "agent" ? (
        <div className="border rounded-lg min-h-[400px] flex flex-col">
          <div className="w-full flex items-center justify-between p-2">
            <p className="text-[11px] text-muted-foreground">
              You have{" "}
              <span className="font-bold">{totalProperty}</span>{" "}
              properties in your favourite list
            </p>

            <div className="flex items-center gap-2">
              <p className="text-[11px] font-medium capitalize">
                sort by:
              </p>
              <DropDownComp
                title={sort}
                className="w-fit gap-2 border text-[11px]"
                component={
                  <div className="flex w-[100px] flex-col gap-2">
                    {Object.entries(_myPropertySort).map(
                      ([, value], index) => (
                        <Button
                          key={index}
                          onClick={() =>
                            setSort(value.value)
                          }
                          className="text-[11px] w-full capitalize"
                          variant="ghost"
                        >
                          {value.label}
                        </Button>
                      )
                    )}
                  </div>
                }
              />
              <Button
                variant="ghost"
                className="rounded-[8px] w-8 h-8 bg-muted"
                size="icon"
              >
                <Search className="w-4" />
              </Button>
            </div>
          </div>

          <div className="flex-grow">
            <Table>
              <TableHeader className="border-y bg-slate-100">
                <TableRow className="h-14">
                  <TableHead className="w-[300px] text-[11px]">
                    listing
                  </TableHead>
                  <TableHead className="text-center text-[11px]">
                    date published
                  </TableHead>
                  <TableHead className="text-center text-[11px]">
                    view
                  </TableHead>
                  <TableHead className="text-center text-[11px]">
                    action
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {currentFavourites.map((pro) => (
                  <TableRow key={pro._id}>
                    <TableCell
                      className="flex gap-2 cursor-pointer"
                      onClick={() =>
                        router.push(`/property/${pro._id}`)
                      }
                    >
                      <Image
                        src={
                          pro.images?.[0] ||
                          "/placeholder.jpg"
                        }
                        alt="Property image"
                        width={300}
                        height={300}
                        className="w-28 aspect-[3/2] rounded-md object-cover"
                      />
                      <div className="flex flex-col gap-1">
                        <h4 className="text-[11px] font-semibold truncate max-w-[200px]">
                          {pro.title}
                        </h4>
                        <h4 className="text-[11px] text-muted-foreground truncate max-w-[200px]">
                          {pro.address}
                        </h4>
                        <h4 className="text-[11px] font-semibold">
                          {currency(pro.price || 0, {
                            symbol: "₦",
                          }).format()}
                        </h4>
                      </div>
                    </TableCell>

                    <TableCell className="text-center text-[11px]">
                      {pro.createdAt
                        ? dayjs(pro.createdAt).format(
                            "DD MMM, YYYY"
                          )
                        : "-"}
                    </TableCell>

                    <TableCell className="text-center text-[11px]">
                      {pro.views || 0}
                    </TableCell>

                    <TableCell className="text-center">
                      <Button
                        onClick={() =>
                          handleLoveClick(pro._id)
                        }
                        variant="ghost"
                        size="sm"
                        className="text-[11px] bg-slate-100"
                      >
                        <Trash2 className="w-3" /> Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="border-t p-2 flex justify-end">
            <PaginationNav
              currectPage={page}
              totalPage={totalPage}
              prevPage={prevPage}
              nextPage={nextPage}
            />
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-2">
          {currentFavourites.map((fav) => (
            <PropertyLayout property={fav as any} key={fav._id} />
          ))}
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
  nextPage: () => void
  prevPage: () => void
  currectPage: number
  totalPage: number
}) {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious onClick={prevPage} />
        </PaginationItem>

        <PaginationItem>
          <PaginationLink isActive>
            <span>{currectPage}</span>
          </PaginationLink>
        </PaginationItem>

        <span className="text-[10px] mx-1">of</span>

        <PaginationItem>
          <PaginationLink>
            <span>{totalPage}</span>
          </PaginationLink>
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
  return remainder === 0
    ? dividend / divisor
    : Math.floor(dividend / divisor) + 1
}
