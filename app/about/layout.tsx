import LayoutWithImageHeader from "@/components/layoutWithImageHeader";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "About us",
  description: "Discover us and our mission."
};

export default function Layout ({children}: {children: ReactNode}) {
    return (
      <LayoutWithImageHeader
        title="Discover us and our mission"
        bgImage='https://images.pexels.com/photos/30986975/pexels-photo-30986975/free-photo-of-aerial-view-of-snow-covered-dock-in-pepin-wisconsin.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
      >
        {children}
      </LayoutWithImageHeader>
    )
}