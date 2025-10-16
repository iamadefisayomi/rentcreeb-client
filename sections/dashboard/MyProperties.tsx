"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import Image from "next/image";
import currency from "currency.js";
import {
  Ellipsis,
  Eye,
  Loader2,
  PenLine,
  Search,
  Trash2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import Routes from "@/Routes";
import useAlert from "@/hooks/useAlert";
import { deleteProperty, updateProperty } from "@/actions/properties";
import { _myPropertySort, _propertyStatus } from "@/_data/_propertyDefault";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import DropDownComp from "@/components/DropdownComp";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { NewPropertySchemaType } from "./formSchemas";

export default function MyProperties({
  properties,
}: {
  properties: (NewPropertySchemaType & {
    createdAt: string;
    _id: string;
    views: number;
  })[];
}) {
  const itemsPerPage = 10;
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("newest");
  const [deleting, setDeleting] = useState(false);
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);

  const { setAlert } = useAlert();
  const router = useRouter();

  const totalProperty = properties.length;
  const totalPage = Math.max(1, Math.ceil(totalProperty / itemsPerPage));

  const handleSortChange = (option: string) => {
    setSort(option);
    setPage(1);
  };

  const handleDelete = async (id: string) => {
    setDeleting(true);
    const { success, message } = await deleteProperty(id);
    setDeleting(false);
    setAlert(
      success ? "Property deleted successfully" : message,
      success ? "success" : "error"
    );
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      setUpdatingStatusId(id);
      const { success, message } = await updateProperty(id, { status });
      if (!success && message) throw new Error(message);
      setAlert("Status updated successfully", "success");
    } catch (err: any) {
      setAlert(err.message);
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const sortedProperties = useMemo(() => {
    return [...properties].sort((a, b) => {
      switch (sort) {
        case "newest":
          return dayjs(b.createdAt).unix() - dayjs(a.createdAt).unix();
        case "best seller":
          return (b.views || 0) - (a.views || 0);
        case "price low":
          return a.price - b.price;
        case "price high":
          return b.price - a.price;
        default:
          return 0;
      }
    });
  }, [properties, sort]);

  const currentProperties = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return sortedProperties.slice(start, start + itemsPerPage);
  }, [sortedProperties, page]);

  return (
    <div className="w-full flex flex-col">
      <h2 className="text-xs font-semibold capitalize pb-4">my properties</h2>

      <div className="border rounded-lg min-h-[400px] flex flex-col">
        <div className="w-full flex items-center justify-between p-2">
          <p className="text-[11px] text-muted-foreground">
            Showing <span className="font-bold">{(page - 1) * itemsPerPage + 1}</span> to <span className="font-bold">{Math.min(page * itemsPerPage, totalProperty)}</span> of <span className="font-bold">{totalProperty}</span> results
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
                {[
                  "listing",
                  "date published",
                  "view",
                  "status",
                  "action",
                ].map((head, idx) => (
                  <TableHead
                    key={idx}
                    className={cn("text-[11px] capitalize text-slate-800 font-semibold", head !== "listing" && "text-center")}
                  >
                    {head}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {currentProperties.map((pro, index) => (
                <TableRow key={index} className="border-b">
                  <TableCell className="flex items-start gap-2">
                    <Image
                      src={pro.images[0] as string || ""}
                      alt={`Property ${index}`}
                      width={300}
                      height={300}
                      className="w-full max-w-28 aspect-[3/2] rounded-md object-cover"
                      loading="lazy"
                      unoptimized
                    />
                    <div className="flex flex-col gap-1 items-start">
                      <h4 className="text-[11px] font-semibold capitalize text-gray-600">{pro.title}</h4>
                      <h4 className="text-[11px] font-medium text-muted-foreground truncate max-w-[200px]">{pro.address}</h4>
                      <h4 className="text-[11px] font-semibold text-gray-700">
                        {currency(pro.price, { symbol: "\u20A6", precision: 2 }).format()}
                      </h4>
                    </div>
                  </TableCell>

                  <TableCell className="text-center text-[11px]">
                    {dayjs(pro.createdAt).format("DD MMM, YYYY")}
                  </TableCell>

                  <TableCell className="text-center text-[11px]">{pro.views || 0}</TableCell>

                  <TableCell>
                    <Menubar className="h-fit p-0 border-none shadow-none bg-transparent">
                      <MenubarMenu>
                        <MenubarTrigger
                          style={{ backgroundColor: _propertyStatus[pro.status] }}
                          className="text-[11px] text-black rounded-2xl capitalize text-muted-foreground flex w-full px-1 items-center justify-center border-none"
                        >
                          {updatingStatusId === pro._id ? <Loader2 className="animate-spin duration-1000 w-3" /> : pro.status}
                        </MenubarTrigger>

                        <MenubarContent className="w-fit min-w-fit">
                          {Object.entries(_propertyStatus).map(([key]) => (
                            <MenubarItem
                              key={key}
                              disabled={key.toLowerCase() === pro.status.toLowerCase()}
                              onClick={() => handleUpdateStatus(pro._id, key)}
                              className={cn("text-[11px] capitalize", key.toLowerCase() === pro.status.toLowerCase() && "bg-slate-100")}
                            >
                              {key}
                            </MenubarItem>
                          ))}
                        </MenubarContent>
                      </MenubarMenu>
                    </Menubar>
                  </TableCell>

                  <TableCell>
                    <Menubar className="h-fit p-0 border-none shadow-none flex items-center justify-center bg-transparent">
                      <MenubarMenu>
                        <MenubarTrigger>
                          <Button size="icon" variant="ghost" className="size-8 bg-slate-100">
                            <Ellipsis className="w-4" />
                          </Button>
                        </MenubarTrigger>

                        <MenubarContent className="w-[100px] min-w-[100px] p-0">
                          <MenubarItem
                            className="flex items-center gap-2 capitalize py-3 cursor-pointer font-medium text-[11px] text-muted-foreground border-b rounded-none"
                            onClick={() => router.push(`/property/${pro._id}`)}
                          >
                            <Eye className="w-3" /> View
                          </MenubarItem>

                          <MenubarItem
                            className="flex items-center gap-2 capitalize py-3 cursor-pointer font-medium text-[11px] text-muted-foreground border-b rounded-none"
                            onClick={() => router.push(`${Routes.dashboard["professional tools"]["my properties"]}/edit/${pro._id}`)}
                          >
                            <PenLine className="w-3" /> Edit
                          </MenubarItem>

                          <Dialog>
                            <DialogTrigger asChild>
                              <button className="flex hover:bg-slate-100 w-full px-2 items-center gap-2 capitalize py-3 cursor-pointer font-medium text-[11px] text-muted-foreground rounded-none">
                                <Trash2 className="w-3" /> Delete
                              </button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md p-6 rounded-lg shadow-lg z-[100]" overlayClassName="z-[100]">
                              <DialogHeader>
                                <DialogTitle className="text-sm font-semibold text-gray-900">Delete Property</DialogTitle>
                                <DialogDescription className="text-xs text-gray-600">
                                  Are you sure you want to delete this property? This action <span className="font-semibold text-primary">cannot be undone</span>.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <p className="text-xs text-gray-500">
                                  If you're unsure, you can cancel this action and review your decision.
                                </p>
                              </div>
                              <DialogFooter className="flex justify-end gap-2">
                                <DialogClose asChild>
                                  <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button loading={deleting} onClick={() => handleDelete(pro._id)}>
                                  Delete Property
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </MenubarContent>
                      </MenubarMenu>
                    </Menubar>
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
            prevPage={() => setPage((p) => Math.max(1, p - 1))}
            nextPage={() => setPage((p) => Math.min(totalPage, p + 1))}
          />
        </div>
      </div>
    </div>
  );
}

function PaginationNav({ nextPage, prevPage, currectPage, totalPage }: { nextPage: () => void; prevPage: () => void; currectPage: number; totalPage: number }) {
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
  );
}
