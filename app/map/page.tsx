"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import RootLayout from "@/sections/layout";

const LeafletMap = dynamic(() => import("@/components/LeafletMap"), { ssr: false });

function MapContent() {
  const searchParams = useSearchParams();
  const lat = parseFloat(searchParams.get("lat") || "51.505");
  const lon = parseFloat(searchParams.get("lon") || "-0.09");

  return (
    <div className="w-full h-screen border">
      <LeafletMap position={[lat, lon]} className="h-[100vh]" />
    </div>
  );
}

export default function MapPage() {
  return (
    <RootLayout>
      <Suspense fallback={<p className="text-center">Loading map...</p>}>
        <MapContent />
      </Suspense>
    </RootLayout>
  );
}
