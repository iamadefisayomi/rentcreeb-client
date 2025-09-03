"use client"

import { ReactNode } from "react";
import BreadcrumbHeader from "./Breadcrumbs";
import BaseLayout from "@/sections/layout";
import { cn } from "@/lib/utils";

interface CustomLayoutProps {
  title?: string;
  children: ReactNode;
  bgImage: string;
  component?: ReactNode;
  showCrumbs?: boolean;
  className?: string;
}

export default function LayoutWithImageHeader({ title, children, bgImage, component, showCrumbs=true, className }: CustomLayoutProps) {
  return (
    <BaseLayout>
      <div className="w-full h-full min-h-screen flex flex-col">
        <div
          className={cn("w-full flex items-center justify-center h-72 md:h-[300px] flex-col gap-4 relative bg-cover bg-center", !title && 'md:h-[250px]', className)}
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black opacity-50 z-0"/>

          { title && <h1 className="text-4xl capitalize text-center font-semibold z-10 text-white cursor-default">{title}</h1> }
         
          {/* Breadcrumb */}
          {title && showCrumbs && 
          <div className="z-10">
            <BreadcrumbHeader className="text-white" />
          </div>}

          {component}
          
        </div>

        {/* Main Content */}
        <div className="w-full flex-grow">{children}</div>
      </div>
    </BaseLayout>
  );
}
