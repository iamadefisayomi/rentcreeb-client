"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ListFilterPlus, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import DropDownComp from "@/components/DropdownComp";
import { _myPropertySort } from "@/_data/_propertyDefault";

export default function SortProperties({
  currentSort,
  onSortChange,
  isPending,
}: {
  currentSort: string;
  onSortChange: (key: string) => void;
  isPending?: boolean;
}) {

  const handleSort = (sortKey: string) => {
    onSortChange(sortKey);
  };

  return (
    <div className="flex items-center justify-end">
      <DropDownComp
        title={currentSort || "Sort"}
        icon={
          isPending ? (
            <Loader2 className="w-4 text-primary animate-spin" />
          ) : (
            <ListFilterPlus className="w-4 text-primary" />
          )
        }
        className="w-[170px]"
        component={
          <div className="w-full flex flex-col gap-1">
            {Object.entries(_myPropertySort).map(([key, value]) => {
              const isActive = currentSort === key;
              return (
                <Button
                  key={key}
                  variant="ghost"
                  onClick={() => handleSort(key)}
                  disabled={isPending}
                  className={cn(
                    "text-muted-foreground justify-between text-[12px] capitalize hover:text-primary",
                    isActive && "text-primary font-medium"
                  )}
                >
                  {value.label}
                  {isActive && <Check className="w-3 h-3 ml-2 text-primary" />}
                </Button>
              );
            })}
          </div>
        }
      />
    </div>
  );
}
