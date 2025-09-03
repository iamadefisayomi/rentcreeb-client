"use client"

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";


// Fix for marker icons not showing up
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// 
const DEFAULT_POSITION: LatLngExpression = [6.5244, 3.3792]; // Lagos, Nigeria

interface MapProps {
  lat?: number;
  lng?: number;
}

const MapWithProps: React.FC<MapProps> = ({ lat, lng }) => {
  const [markerPosition, setMarkerPosition] = useState<LatLngExpression>(DEFAULT_POSITION);

  useEffect(() => {
    if (lat && lng) {
      setMarkerPosition([lat, lng]);
    }
  }, [lat, lng]); // Update when props change

  return (
    <MapContainer
      center={markerPosition}
      zoom={13}
      style={{ width: "100%", maxHeight: "500px", zIndex: 1, height: '100%' }}
    >
      <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
      <Marker position={markerPosition}>
        <Popup>
          <span className="text-[11px] text-gray-700 font-medium">Location Found!</span>
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapWithProps;
