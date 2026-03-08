// src/app/components/maps/VictimMap.tsx

import { useEffect } from "react";
import { motion } from "motion/react";
import { Calendar, MapPin } from "lucide-react";
import { MapContainer, Circle, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Card } from "../ui/card";
import type { mockVictims } from "@/app/data/mock-data";

// ── Fix Leaflet icons ─────────────────────────────────────────────────────────
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// ── CSS animación de pulso ────────────────────────────────────────────────────
const pulseCSS = `
  @keyframes vmPulse1 {
    0%   { transform: scale(1);   opacity: 0.75; }
    70%  { transform: scale(2.8); opacity: 0;    }
    100% { transform: scale(2.8); opacity: 0;    }
  }
  @keyframes vmPulse2 {
    0%   { transform: scale(1);   opacity: 0.45; }
    70%  { transform: scale(2.1); opacity: 0;    }
    100% { transform: scale(2.1); opacity: 0;    }
  }
  .vm-wrap { position: relative; width: 40px; height: 40px; }
  .vm-pin  {
    position: absolute; inset: 0; margin: auto;
    width: 16px; height: 16px;
    background: #b91c1c;
    border-radius: 50%;
    border: 3px solid #fff;
    box-shadow: 0 2px 12px rgba(185,28,28,0.55);
    z-index: 2;
  }
  .vm-r1 {
    position: absolute; inset: 0; margin: auto;
    width: 16px; height: 16px; border-radius: 50%;
    background: rgba(185,28,28,0.42);
    animation: vmPulse1 2.2s ease-out infinite;
    z-index: 1;
  }
  .vm-r2 {
    position: absolute; inset: 0; margin: auto;
    width: 16px; height: 16px; border-radius: 50%;
    background: rgba(185,28,28,0.22);
    animation: vmPulse2 2.2s ease-out infinite 0.5s;
    z-index: 1;
  }
`;

if (
  typeof document !== "undefined" &&
  !document.getElementById("vm-pulse-style")
) {
  const tag = document.createElement("style");
  tag.id = "vm-pulse-style";
  tag.textContent = pulseCSS;
  document.head.appendChild(tag);
}

const pulsingIcon = L.divIcon({
  className: "",
  html: `<div class="vm-wrap">
    <div class="vm-r2"></div>
    <div class="vm-r1"></div>
    <div class="vm-pin"></div>
  </div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

// ── Tile layer con filtro sepia ───────────────────────────────────────────────
function SepiaLayer() {
  const map = useMap();
  useEffect(() => {
    const layer = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      { attribution: "&copy; OpenStreetMap", maxZoom: 19 },
    );
    layer.addTo(map);
    const pane = map.getPane("tilePane");
    if (pane) {
      pane.style.filter =
        "sepia(0.72) saturate(0.55) brightness(0.86) contrast(1.08)";
    }
    return () => {
      layer.remove();
      if (pane) pane.style.filter = "";
    };
  }, [map]);
  return null;
}

function SetView({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 14);
  }, [lat, lng, map]);
  return null;
}

// ── Props ─────────────────────────────────────────────────────────────────────
interface VictimMapProps {
  victim: (typeof mockVictims)[0];
}

// ── Componente exportado ──────────────────────────────────────────────────────
export function VictimMap({ victim }: VictimMapProps) {
  const { lat, lng } = victim.location!;

  return (
    <Card className="overflow-hidden shadow-xl border border-[#d4c4a8]/40">
      {/* Barra de coordenadas */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-[#d4c4a8]/30 bg-[#faf5ec]">
        <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse flex-shrink-0" />
        <p className="text-xs text-[#7a6a55] tracking-wide font-medium">
          {victim.municipality}, Caldas
          <span className="mx-2 text-[#c8b89a]">/</span>
          <span className="font-mono text-[#a09070]">
            {lat.toFixed(5)}, {lng.toFixed(5)}
          </span>
        </p>
      </div>

      {/* Mapa */}
      <div className="relative" style={{ height: 440 }}>
        <MapContainer
          center={[lat, lng]}
          zoom={14}
          scrollWheelZoom={false}
          zoomControl={false}
          attributionControl={false}
          className="w-full h-full"
          style={{ zIndex: 0 }}
        >
          <SepiaLayer />
          <SetView lat={lat} lng={lng} />

          {/* Círculo exterior punteado */}
          <Circle
            center={[lat, lng]}
            radius={350}
            pathOptions={{
              color: "#b91c1c",
              fillColor: "#b91c1c",
              fillOpacity: 0.06,
              weight: 1.5,
              opacity: 0.3,
              dashArray: "7 6",
            }}
          />
          {/* Círculo interior suave */}
          <Circle
            center={[lat, lng]}
            radius={110}
            pathOptions={{
              color: "#b91c1c",
              fillColor: "#b91c1c",
              fillOpacity: 0.1,
              weight: 0,
            }}
          />

          <Marker position={[lat, lng]} icon={pulsingIcon} />
        </MapContainer>

        {/* Gradientes en los 4 bordes */}
        <div className="absolute inset-0 pointer-events-none z-10">
          <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-[#f0e6d0]/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#ede0c8]/65 to-transparent" />
          <div className="absolute top-0 bottom-0 left-0 w-20 bg-gradient-to-r from-[#f0e6d0]/45 to-transparent" />
          <div className="absolute top-0 bottom-0 right-0 w-20 bg-gradient-to-l from-[#f0e6d0]/45 to-transparent" />
        </div>

        {/* Badge esquina superior derecha */}
        <div className="absolute top-4 right-4 z-20 pointer-events-none">
          <div
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-[#7c2d12] border border-[#b91c1c]/20 shadow"
            style={{
              background: "rgba(250,245,236,0.90)",
              backdropFilter: "blur(8px)",
            }}
          >
            <MapPin className="w-3 h-3 text-[#b91c1c]" />
            Lugar de desaparición
          </div>
        </div>

        {/* Info card flotante */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
          className="absolute bottom-5 left-5 z-20 pointer-events-none"
        >
          <div
            className="rounded-xl px-4 py-3 shadow-lg border border-[#d4c4a8]/45 max-w-[240px]"
            style={{
              background: "rgba(250,245,236,0.93)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div className="flex items-center gap-3">
              {victim.photo && (
                <img
                  src={victim.photo}
                  alt={victim.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-[#b91c1c]/25 flex-shrink-0"
                  style={{ filter: "sepia(0.25)" }}
                />
              )}
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#3a2e22] leading-tight truncate">
                  {victim.name}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <Calendar className="w-3 h-3 text-[#b91c1c] flex-shrink-0" />
                  <p className="text-xs text-[#7a6a55] leading-tight">
                    {new Date(victim.dateOfDisappearance).toLocaleDateString(
                      "es-CO",
                      { day: "numeric", month: "long", year: "numeric" },
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Card>
  );
}
