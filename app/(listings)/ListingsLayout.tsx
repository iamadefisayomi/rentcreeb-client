"use client";

import { _myPropertySort } from "@/_data/_propertyDefault";
import DropDownComp from "@/components/DropdownComp";
import LayoutWithImageHeader from "@/components/layoutWithImageHeader";
import { ShowToolTip } from "@/components/showTooTip";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import PropertyNotFound from "@/sections/listings/propertyNotFound";
import HomeFilterForm from "@/sections/SearchForms/HomeFilterForm";
import { HomeSearchBox } from "@/sections/SearchForms/HomeSearchBox";
import { Grid2X2, List, ListFilterPlus } from "lucide-react";
import { ReactNode } from "react";
import { motion } from "framer-motion";
import usePageSettings from "@/contexts/usePageSettings";

export default function ListingsLayout({
  children,
  bgImage,
  className,
}: {
  children: ReactNode;
  bgImage?: string;
  className?: string;
}) {
  const { pageViewStyle } = usePageSettings();

  return (
    <LayoutWithImageHeader
      bgImage={bgImage || "/for-rent.svg"}
      className={className}
      component={
        <div className="p-4 w-full flex items-center justify-center absolute top-52 md:relative z-20 md:top-0">
          <HomeSearchBox />
        </div>
      }
    >
      <div className={cn("w-full flex flex-col mx-auto gap-4 max-w-7xl px-4", pageViewStyle === "grid" && "")}>
        {pageViewStyle === "list" && <PageViewStyleAndSort />}

        <div className="w-full flex-grow">
          <div className="py-32 md:hidden flex" />
          <div className="w-full mx-auto flex items-start pb-10 gap-4">
            <div className="w-full hidden flex-col items-start max-w-xs md:flex">
              <HomeFilterForm />
              <PropertyNotFound />
            </div>

            <div className="w-full flex flex-col gap-4">
              {pageViewStyle === "grid" && <PageViewStyleAndSort />}

              <div className={cn("w-full grid grid-cols-1 gap-4", pageViewStyle === 'grid' && "md:grid-cols-2")}>
                {children}
              </div>

            </div>
          </div>
        </div>
      </div>
    </LayoutWithImageHeader>
  );
}

const PageViewStyleAndSort = () => {
  const { pageViewStyle, setPageViewStyle } = usePageSettings();

  const buttonVariants = {
    inactive: { scale: 1, backgroundColor: "rgba(0,0,0,0)" },
    active: { scale: 1.05, backgroundColor: "rgba(59,130,246,0.1)" }, // bg-blue-100
  };

  return (
    <div className="w-full grid gap-2 grid-cols-2">
      <div className="flex items-center gap-4 py-3">
        <ShowToolTip title="Grid view">
          <motion.button
            aria-label="Grid view"
            aria-pressed={pageViewStyle === "grid"}
            onClick={() => setPageViewStyle("grid")}
            className={cn(
              "px-2 py-1 rounded-sm text-muted-foreground transition-colors border-2 border-blue-100",
              pageViewStyle === "grid" && "text-primary"
            )}
            initial="inactive"
            animate={pageViewStyle === "grid" ? "active" : "inactive"}
            variants={buttonVariants}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Grid2X2 className="w-5" />
          </motion.button>
        </ShowToolTip>

        <ShowToolTip title="List view">
          <motion.button
            aria-label="List view"
            aria-pressed={pageViewStyle === "list"}
            onClick={() => setPageViewStyle("list")}
            className={cn(
              "px-2 py-1 rounded-sm text-muted-foreground transition-colors border-2 border-blue-100",
              pageViewStyle === "list" && "text-primary"
            )}
            initial="inactive"
            animate={pageViewStyle === "list" ? "active" : "inactive"}
            variants={buttonVariants}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <List className="w-5" />
          </motion.button>
        </ShowToolTip>
      </div>

      <div className="flex items-center justify-end">
        <DropDownComp
          title={"sort"}
          icon={<ListFilterPlus className="w-4 text-primary" />}
          component={
            <div className="w-full flex flex-col gap-2">
              {Object.entries(_myPropertySort).map(([key, value], index) => (
                <Button
                  className="text-muted-foreground capitalize text-[11px]"
                  variant="ghost"
                  key={index}
                >
                  {value.label}
                </Button>
              ))}
            </div>
          }
          className="w-[150px]"
        />
      </div>
    </div>
  );
};
