// src/app/components/maps/MapPreview.tsx

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useMemoryPlaces } from "@/app/context/MemoryPlacesContext";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const createCustomIcon = (color: string) =>
  L.divIcon({
    className: "",
    html: `<div style="
      width:22px;height:22px;background:${color};
      border-radius:50% 50% 50% 0;transform:rotate(-45deg);
      border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 22],
  });

const typeIcons: Record<string, L.DivIcon> = {
  disappearance: createCustomIcon("#ef4444"),
  encounter: createCustomIcon("#2E4739"),
  memorial: createCustomIcon("#B2916F"),
};

export function MapPreview() {
  const { places } = useMemoryPlaces();

  return (
    <div className="w-full h-full">
      <MapContainer
        center={[5.4167, -75.0167]}
        zoom={12}
        scrollWheelZoom={false}
        dragging={false}
        doubleClickZoom={false}
        zoomControl={false}
        className="w-full h-full"
        style={{ zIndex: 0 }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {places.map((place) => (
          <Marker
            key={place.id}
            position={[place.location.lat, place.location.lng]}
            icon={typeIcons[place.type] ?? typeIcons.memorial}
          />
        ))}
      </MapContainer>
    </div>
  );
}
