import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ReactNode } from "react"


export function ShowToolTip ({children, title}: {children: ReactNode, title: string | any}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span>{children}</span>
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-xs font-medium">{title}</p>
      </TooltipContent>
    </Tooltip>
  )
}
