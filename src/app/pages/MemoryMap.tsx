// src/app/pages/MemoryMap.tsx

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  MapPin,
  Filter,
  X,
  AlertTriangle,
  Search,
  Landmark,
  Calendar,
} from "lucide-react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { mockVictims } from "../data/mock-data";
import { useMemoryPlaces } from "../context/MemoryPlacesContext";
import {
  MapContainer,
  TileLayer,
  Marker,
  GeoJSON,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import samanaData from "../data/samana.json";

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
      width:32px;height:32px;background:${color};
      border-radius:50% 50% 50% 0;transform:rotate(-45deg);
      border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.35);
    "></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });

const typeIcons: Record<string, L.DivIcon> = {
  disappearance: createCustomIcon("#ef4444"),
  encounter: createCustomIcon("#2E4739"),
  memorial: createCustomIcon("#B2916F"),
};

const samanaStyle = {
  color: "#2E4739",
  weight: 2.5,
  opacity: 0.9,
  fillColor: "#2E4739",
  fillOpacity: 0.08,
  dashArray: "6 4",
};

const typeConfig: Record<
  string,
  { label: string; color: string; bg: string; bar: string }
> = {
  disappearance: {
    label: "Desaparición",
    color: "text-red-500",
    bg: "bg-red-100",
    bar: "bg-red-500",
  },
  encounter: {
    label: "Encuentro",
    color: "text-[#2E4739]",
    bg: "bg-[#e8f0ea]",
    bar: "bg-[#2E4739]",
  },
  memorial: {
    label: "Memorial",
    color: "text-[#B2916F]",
    bg: "bg-[#f5ede5]",
    bar: "bg-[#B2916F]",
  },
};

function FlyToLocation({
  target,
}: {
  target: { lat: number; lng: number } | null;
}) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo([target.lat, target.lng], 15, { duration: 1.5 });
  }, [target, map]);
  return null;
}

function FitBounds() {
  const map = useMap();
  useEffect(() => {
    try {
      const layer = L.geoJSON(samanaData as any);
      const bounds = layer.getBounds();
      if (bounds.isValid()) map.fitBounds(bounds, { padding: [30, 30] });
    } catch (e) {
      console.warn(e);
    }
  }, [map]);
  return null;
}

// Tipo unificado para víctimas (mock + locales)
interface AnyVictim {
  id: string;
  name: string;
  dateOfDisappearance: string;
  photo?: string;
}

function MarkerPopup({
  place,
  allVictims,
  onClose,
}: {
  place: ReturnType<typeof useMemoryPlaces>["places"][0];
  allVictims: AnyVictim[];
  onClose: () => void;
}) {
  const map = useMap();
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const update = () => {
      const point = map.latLngToContainerPoint([
        place.location.lat,
        place.location.lng,
      ]);
      setPos({ x: point.x, y: point.y });
    };
    update();
    map.on("move zoom moveend zoomend", update);
    return () => {
      map.off("move zoom moveend zoomend", update);
    };
  }, [map, place]);

  if (!pos) return null;

  const mapSize = map.getSize();
  const popupW = 300;
  const popupH = 280;
  const offset = 18;
  const goRight = pos.x + popupW + offset < mapSize.x;
  const left = goRight ? pos.x + offset : pos.x - popupW - offset;
  let top = pos.y - popupH / 2;
  top = Math.max(8, Math.min(top, mapSize.y - popupH - 8));

  const cfg = typeConfig[place.type];
  const victims = place.victims ?? [];

  // Buscar la primera víctima vinculada (para mostrar fecha en desapariciones)
  const linkedVictim =
    place.type === "disappearance" && victims.length > 0
      ? allVictims.find((v) => victims.includes(v.id))
      : null;

  return createPortal(
    <motion.div
      key={place.id}
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      style={{ position: "absolute", left, top, width: popupW, zIndex: 1000 }}
      className="bg-white rounded-2xl shadow-2xl overflow-hidden pointer-events-auto"
    >
      <div className={`h-1.5 w-full ${cfg.bar}`} />
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-display text-lg leading-tight">{place.name}</h3>
            <span
              className={`inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}
            >
              {cfg.label}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100 flex-shrink-0 ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Fecha de desaparición (solo tipo disappearance) */}
        {linkedVictim && (
          <div className="flex items-center gap-1.5 mb-2 text-xs text-gray-500">
            <Calendar className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
            <span>
              {new Date(linkedVictim.dateOfDisappearance).toLocaleDateString(
                "es-CO",
                { day: "numeric", month: "long", year: "numeric" },
              )}
            </span>
          </div>
        )}

        <p className="text-gray-700 text-sm leading-relaxed mb-3">
          {place.description}
        </p>

        {victims.length > 0 && (
          <div className="border-t pt-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Víctimas asociadas ({victims.length})
            </p>
            <div className="space-y-1.5">
              {victims.slice(0, 3).map((victimId) => {
                const victim = allVictims.find((v) => v.id === victimId);
                return victim ? (
                  <div
                    key={victimId}
                    className="flex items-center gap-2 text-sm"
                  >
                    {victim.photo ? (
                      <img
                        src={victim.photo}
                        alt={victim.name}
                        className="w-7 h-7 rounded-full object-cover ring-2 ring-white shadow"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center ring-2 ring-white shadow text-gray-400 text-xs font-bold flex-shrink-0">
                        {victim.name.charAt(0)}
                      </div>
                    )}
                    <span className="text-gray-800">{victim.name}</span>
                  </div>
                ) : null;
              })}
              {victims.length > 3 && (
                <p className="text-xs text-gray-400 pl-9">
                  +{victims.length - 3} más
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>,
    map.getContainer(),
  );
}

export function MemoryMap() {
  const { places, localVictims } = useMemoryPlaces();
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [flyTarget, setFlyTarget] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const filteredPlaces = places.filter(
    (p) => typeFilter === "all" || p.type === typeFilter,
  );
  const selectedPlaceData = selectedPlace
    ? places.find((p) => p.id === selectedPlace)
    : null;

  // Unificar víctimas del mock con las creadas localmente en sesión
  const allVictims: AnyVictim[] = [...mockVictims, ...localVictims];

  const handleSelectPlace = (place: (typeof places)[0]) => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setSelectedPlace(place.id);
    setFlyTarget({ lat: place.location.lat, lng: place.location.lng });
    closeTimerRef.current = setTimeout(() => setSelectedPlace(null), 8000);
  };

  const handleClose = () => {
    setSelectedPlace(null);
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F6F3ED] to-[#FFFDF8]">
      {/* HERO */}
      <section className="bg-gradient-to-r from-[#2E4739] to-[#3d5a49] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <MapPin className="w-16 h-16 mx-auto mb-6 text-[#B2916F]" />
          <h1 className="font-display text-5xl mb-6">Mapa de Memoria</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Cada lugar cuenta una historia. Explora los sitios que preservan la
            memoria de las víctimas en Samaná, Caldas.
          </p>
        </div>
      </section>

      {/* TIPOS */}
      <section className="py-10 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-display text-3xl text-center mb-8">
            Tipos de lugares de memoria
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 text-center">
              <AlertTriangle className="w-8 h-8 mx-auto mb-3 text-red-500" />
              <h3 className="font-display text-lg mb-2">Desaparición</h3>
              <p className="text-gray-600 text-sm">
                Lugares donde ocurrieron desapariciones forzadas durante el
                conflicto armado.
              </p>
            </Card>
            <Card className="p-6 text-center">
              <Search className="w-8 h-8 mx-auto mb-3 text-[#2E4739]" />
              <h3 className="font-display text-lg mb-2">Eventos/Encuentros</h3>
              <p className="text-gray-600 text-sm">
                Lugares donde se reunen familias o comunidades para recordar y
                honrar a las víctimas.
              </p>
            </Card>
            <Card className="p-6 text-center">
              <Landmark className="w-8 h-8 mx-auto mb-3 text-[#B2916F]" />
              <h3 className="font-display text-lg mb-2">Memorial</h3>
              <p className="text-gray-600 text-sm">
                Espacios de memoria creados para dignificar a las víctimas.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* MAPA + FILTROS */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {/* COLUMNA IZQUIERDA */}
            <div className="flex flex-col space-y-6">
              <Card className="p-6">
                <h3 className="font-display text-xl mb-4 flex items-center gap-2">
                  <Filter className="w-5 h-5 text-[#B2916F]" /> Filtrar por Tipo
                </h3>
                <div className="space-y-2">
                  {[
                    { key: "all", label: "Todos los lugares", dot: null },
                    {
                      key: "disappearance",
                      label: "Desaparición",
                      dot: "bg-red-500",
                    },
                    {
                      key: "encounter",
                      label: "Evento/Encuentro",
                      dot: "bg-[#2E4739]",
                    },
                    { key: "memorial", label: "Memorial", dot: "bg-[#B2916F]" },
                  ].map(({ key, label, dot }) => (
                    <Button
                      key={key}
                      variant={typeFilter === key ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => setTypeFilter(key)}
                    >
                      {dot && (
                        <div className={`w-3 h-3 rounded-full ${dot} mr-2`} />
                      )}
                      {label}
                    </Button>
                  ))}
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div
                    className="w-8 h-4 rounded flex-shrink-0"
                    style={{
                      border: "2.5px dashed #2E4739",
                      background: "rgba(46,71,57,0.08)",
                    }}
                  />
                  <span>Límite municipal de Samaná, Caldas</span>
                </div>
              </Card>

              <div className="max-h-[420px] overflow-y-auto pr-1 space-y-4">
                {filteredPlaces.map((place) => (
                  <Card
                    key={place.id}
                    className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-md border-2 ${
                      selectedPlace === place.id
                        ? "border-[#B2916F] shadow-md"
                        : "border-transparent"
                    }`}
                    onClick={() => handleSelectPlace(place)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-display text-lg">{place.name}</h4>
                        <span
                          className={`inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded-full ${typeConfig[place.type].bg} ${typeConfig[place.type].color}`}
                        >
                          {typeConfig[place.type].label}
                        </span>
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                          {place.description}
                        </p>
                      </div>
                      <MapPin
                        className={`w-5 h-5 flex-shrink-0 ml-2 ${typeConfig[place.type].color}`}
                      />
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* MAPA */}
            <div className="lg:col-span-2 h-full">
              <Card
                className="p-0 overflow-hidden relative h-full"
                style={{ minHeight: "600px" }}
              >
                <MapContainer
                  center={[5.5, -75.0]}
                  zoom={11}
                  scrollWheelZoom
                  className="w-full h-full"
                  style={{ zIndex: 0, minHeight: "600px" }}
                >
                  <TileLayer
                    attribution="&copy; OpenStreetMap"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <GeoJSON
                    key="samana-boundary"
                    data={samanaData as any}
                    style={samanaStyle}
                  />
                  <FitBounds />
                  <FlyToLocation target={flyTarget} />
                  {filteredPlaces.map((place) => (
                    <Marker
                      key={place.id}
                      position={[place.location.lat, place.location.lng]}
                      icon={typeIcons[place.type]}
                      eventHandlers={{ click: () => handleSelectPlace(place) }}
                    />
                  ))}
                  <AnimatePresence>
                    {selectedPlaceData && (
                      <MarkerPopup
                        place={selectedPlaceData}
                        allVictims={allVictims}
                        onClose={handleClose}
                      />
                    )}
                  </AnimatePresence>
                </MapContainer>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
