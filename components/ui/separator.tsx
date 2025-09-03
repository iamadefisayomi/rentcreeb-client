"use client"

import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

import { cn } from "../../lib/utils"

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
  (
    { className, orientation = "horizontal", decorative = true, ...props },
    ref
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      )}
      {...props}
    />
  )
)
Separator.displayName = SeparatorPrimitive.Root.displayName


type LabelSeparator = {
  className?: string,
  label?: string,
}
const LabelSeparator = React.forwardRef(
  (
    { className, label }: LabelSeparator
  ) => (
    <div className={`${className} inline-flex items-center justify-center w-full `}>
    <hr className= {`w-full h-1 my-1`}/>
    <div className="absolute px-4 -translate-x-1/2 left-1/2 bg-background">
        {label}
    </div>
</div>
  )
)

LabelSeparator.displayName = 'Separator'

export { Separator, LabelSeparator }