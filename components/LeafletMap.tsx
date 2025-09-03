"use client";

import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L, { LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";
import { cn } from "@/lib/utils";

// Fix for missing Leaflet marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Default coordinates (Lagos, Nigeria)
const DEFAULT_POSITION: LatLngTuple = [6.4698, 3.5852];

interface LeafletMapComponentProps {
  position?: LatLngTuple;
  className?: string;
}

const LeafletMapComponent: React.FC<LeafletMapComponentProps> = ({ position = DEFAULT_POSITION, className }) => {
  return (
    <MapContainer
      center={position}
      zoom={13}
      // style={{
      //   height: "600px",
      //   maxHeight: "100vh",
      //   width: "100%",
      //   zIndex: 1,
      // }}
      className={cn("w-full z-[10] h-[600px] max-h-[100vh]", className)}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={position}>
        <Popup>A pretty CSS3 popup. <br /> Easily customizable.</Popup>
      </Marker>
    </MapContainer>
  );
};

export default LeafletMapComponent;
