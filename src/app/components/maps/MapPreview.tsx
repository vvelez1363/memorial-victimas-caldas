// src/app/components/maps/MapPreview.tsx

import { useEffect } from "react";
import { MapContainer, GeoJSON, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useMemoryPlaces } from "@/app/context/MemoryPlacesContext";
import samanaData from "@/app/data/samana.json";

// ── Fix Leaflet icons ─────────────────────────────────────────────────────────
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// ── Íconos por tipo — cálidos y visibles sobre fondo claro ───────────────────
const createIcon = (color: string, size = 16) =>
  L.divIcon({
    className: "",
    html: `<div style="
      width:${size}px;height:${size}px;background:${color};
      border-radius:50% 50% 50% 0;transform:rotate(-45deg);
      border:2.5px solid white;
      box-shadow:0 2px 8px rgba(0,0,0,0.22);
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
  });

const typeIcons: Record<string, L.DivIcon> = {
  disappearance: createIcon("#dc2626"),
  encounter: createIcon("#2E4739"),
  memorial: createIcon("#B2916F"),
};

// ── Estilo GeoJSON — borde verde sobrio ───────────────────────────────────────
const samanaStyle = {
  color: "#2E4739",
  weight: 2,
  opacity: 0.5,
  fillColor: "#2E4739",
  fillOpacity: 0.05,
  dashArray: "6 4",
};

// ── Tile layer: sepia suave para coherencia con el resto de la app ────────────
function WarmLayer() {
  const map = useMap();
  useEffect(() => {
    const layer = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      { attribution: "&copy; OpenStreetMap", maxZoom: 19 },
    );
    layer.addTo(map);
    const pane = map.getPane("tilePane");
    if (pane) {
      // Sepia muy suave: mantiene legibilidad y calidez sin oscurecer
      pane.style.filter =
        "sepia(0.35) saturate(0.75) brightness(1.02) contrast(0.96)";
    }
    return () => {
      layer.remove();
      if (pane) pane.style.filter = "";
    };
  }, [map]);
  return null;
}

// ── Ajusta el zoom para mostrar todo Samaná ───────────────────────────────────
function FitSamana() {
  const map = useMap();
  useEffect(() => {
    try {
      const layer = L.geoJSON(samanaData as any);
      const bounds = layer.getBounds();
      if (bounds.isValid()) map.fitBounds(bounds, { padding: [-10, -10] });
    } catch (e) {
      console.warn(e);
    }
  }, [map]);
  return null;
}

// ── Leyenda de tipos ──────────────────────────────────────────────────────────
const legend = [
  { color: "#dc2626", label: "Desaparición" },
  { color: "#2E4739", label: "Encuentro" },
  { color: "#B2916F", label: "Memorial" },
];

// ── Componente principal ──────────────────────────────────────────────────────
export function MapPreview() {
  const { places } = useMemoryPlaces();

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={[5.4167, -75.0167]}
        zoom={12}
        scrollWheelZoom={false}
        dragging={false}
        doubleClickZoom={false}
        zoomControl={false}
        attributionControl={false}
        className="w-full h-full"
        style={{ zIndex: 0, background: "#f5efe4" }}
      >
        <WarmLayer />
        <FitSamana />

        <GeoJSON
          key="samana-preview"
          data={samanaData as any}
          style={samanaStyle}
        />

        {places.map((place) => (
          <Marker
            key={place.id}
            position={[place.location.lat, place.location.lng]}
            icon={typeIcons[place.type] ?? typeIcons.memorial}
          />
        ))}
      </MapContainer>

      {/* Gradientes en los 4 bordes — tono crema de la página */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="absolute top-0 left-0 right-0 h-14 bg-gradient-to-b from-[#f5efe4]/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#f0e8d8]/70 to-transparent" />
        <div className="absolute top-0 bottom-0 left-0 w-14 bg-gradient-to-r from-[#f5efe4]/55 to-transparent" />
        <div className="absolute top-0 bottom-0 right-0 w-14 bg-gradient-to-l from-[#f5efe4]/55 to-transparent" />
      </div>

      {/* Leyenda flotante — esquina superior izquierda */}
      <div className="absolute top-3 left-3 z-20 pointer-events-none">
        <div
          className="rounded-xl px-3 py-2.5 space-y-1.5 border border-[#d4c4a8]/50 shadow-sm"
          style={{
            background: "rgba(255,253,248,0.90)",
            backdropFilter: "blur(8px)",
          }}
        >
          {legend.map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ background: color }}
              />
              <span className="text-xs text-[#5a4a3a] font-medium tracking-wide">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Badge ubicación — esquina superior derecha */}
      <div className="absolute top-3 right-3 z-20 pointer-events-none">
        <div
          className="rounded-full px-3 py-1.5 text-xs font-semibold text-[#3a2e22] border border-[#d4c4a8]/50 shadow-sm"
          style={{
            background: "rgba(255,253,248,0.90)",
            backdropFilter: "blur(8px)",
          }}
        >
          Samaná, Caldas
        </div>
      </div>
    </div>
  );
}
