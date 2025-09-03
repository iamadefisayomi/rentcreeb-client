

import React, { useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L, { LatLngTuple, Map } from "leaflet";
import "leaflet/dist/leaflet.css";
import { cn } from "@/lib/utils";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const DEFAULT_POSITION: LatLngTuple = [6.4698, 3.5852];

interface LeafletMapComponentProps {
  position?: LatLngTuple;
  className?: string;
  onSelect?: (coords: LatLngTuple) => void;
  address?: string;
}

const AddPropertyMap: React.FC<LeafletMapComponentProps> = ({
  position = DEFAULT_POSITION,
  className,
  onSelect,
  address
}) => {
  const [markerPos, setMarkerPos] = React.useState(position);
  const mapRef = useRef<Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;
    const handleClick = (e: L.LeafletMouseEvent) => {
      const coords: LatLngTuple = [e.latlng.lat, e.latlng.lng];
      setMarkerPos(coords);
      onSelect?.(coords);
    };

    map.on("click", handleClick);
    return () => {
      map.off("click", handleClick);
    };
  }, [onSelect]);

  useEffect(() => {
  if (!address) return;

  geocodeAddress(address).then((coords) => {
    if (coords && mapRef.current) {
      setMarkerPos(coords);
      mapRef.current.setView(coords, 13);
    }
  });
}, [address]);

  return (
    <MapContainer
      center={markerPos}
      zoom={13}
      className={cn("w-full z-[10] h-[600px]", className)}
      ref={(mapInstance) => {
        if (mapInstance) mapRef.current = mapInstance;
      }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={markerPos}>
        <Popup>Selected Location</Popup>
      </Marker>
    </MapContainer>
  );
};

export default AddPropertyMap;


export async function geocodeAddress(address: string): Promise<LatLngTuple | null> {
  const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
  const data = await res.json();
  if (data && data.length > 0) {
    const lat = parseFloat(data[0].lat);
    const lon = parseFloat(data[0].lon);
    return [lat, lon];
  }
  return null;
}

export async function getAddressFromCoords(lat: number, lng: number): Promise<string | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
      {
        headers: {
          'User-Agent': 'rentcreeb-inc', // Required by Nominatim's usage policy
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();

    return data.display_name || null;
  } catch (error) {
    console.error('Error getting address:', error);
    return null;
  }
}
