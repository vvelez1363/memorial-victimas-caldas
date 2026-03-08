// src/app/components/maps/AdminMemoryMap.tsx

import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  GeoJSON,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  X,
  MapPin,
  Check,
  User,
  Navigation,
  UserPlus,
  AlertCircle,
} from "lucide-react";
import { useMemoryPlaces } from "@/app/context/MemoryPlacesContext";
import { mockVictims } from "@/app/data/mock-data";
import type { MemoryPlace } from "@/app/data/mock-data";
import samanaData from "@/app/data/samana.json";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const createCustomIcon = (color: string, size = 32) =>
  L.divIcon({
    className: "",
    html: `<div style="
      width:${size}px;height:${size}px;background:${color};
      border-radius:50% 50% 50% 0;transform:rotate(-45deg);
      border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.35);
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
  });

const typeIcons: Record<string, L.DivIcon> = {
  disappearance: createCustomIcon("#ef4444"),
  encounter: createCustomIcon("#2E4739"),
  memorial: createCustomIcon("#B2916F"),
};
const pendingIcon = createCustomIcon("#C9A227", 36);

const samanaStyle = {
  color: "#2E4739",
  weight: 2.5,
  opacity: 0.9,
  fillColor: "#2E4739",
  fillOpacity: 0.06,
  dashArray: "6 4",
};

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface NewVictimForm {
  name: string;
  dateOfDisappearance: string;
  photo: string;
}

type CoordMode = "map" | "manual";

const EMPTY_NEW_VICTIM: NewVictimForm = {
  name: "",
  dateOfDisappearance: "",
  photo: "",
};

// ─── Subcomponentes del mapa ──────────────────────────────────────────────────

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

function ClickHandler({
  onMapClick,
  active,
}: {
  onMapClick: (lat: number, lng: number) => void;
  active: boolean;
}) {
  useMapEvents({
    click(e) {
      if (active) onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function FlyToPoint({ point }: { point: { lat: number; lng: number } | null }) {
  const map = useMap();
  useEffect(() => {
    if (point) map.flyTo([point.lat, point.lng], 14, { duration: 1 });
  }, [point, map]);
  return null;
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function AdminMemoryMap() {
  const { places, addPlace, removePlace, localVictims, addLocalVictim } =
    useMemoryPlaces();

  const [addingMode, setAddingMode] = useState(false);
  const [coordMode, setCoordMode] = useState<CoordMode>("map");
  const [pendingPoint, setPendingPoint] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [flyTarget, setFlyTarget] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [manualLat, setManualLat] = useState("");
  const [manualLng, setManualLng] = useState("");
  const [coordError, setCoordError] = useState("");

  const [form, setForm] = useState<{
    name: string;
    type: MemoryPlace["type"];
    description: string;
    victims: string[];
  }>({ name: "", type: "memorial", description: "", victims: [] });

  // Formulario de nueva víctima (solo activo cuando type === "disappearance")
  const [newVictim, setNewVictim] = useState<NewVictimForm>(EMPTY_NEW_VICTIM);
  const [newVictimErrors, setNewVictimErrors] = useState<
    Partial<Record<keyof NewVictimForm, string>>
  >({});

  const [successMsg, setSuccessMsg] = useState(false);

  // ── Coordenadas ────────────────────────────────────────────────────────────

  const openForm = (lat: number, lng: number) => {
    setPendingPoint({ lat, lng });
    setManualLat(lat.toFixed(6));
    setManualLng(lng.toFixed(6));
    setCoordError("");
    setShowForm(true);
  };

  const handleMapClick = (lat: number, lng: number) => openForm(lat, lng);

  const handleManualApply = () => {
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);
    if (isNaN(lat) || isNaN(lng)) {
      setCoordError("Ingresa números válidos.");
      return;
    }
    if (lat < -90 || lat > 90) {
      setCoordError("Latitud debe estar entre -90 y 90.");
      return;
    }
    if (lng < -180 || lng > 180) {
      setCoordError("Longitud debe estar entre -180 y 180.");
      return;
    }
    setCoordError("");
    const pt = { lat, lng };
    setPendingPoint(pt);
    setFlyTarget(pt);
    setShowForm(true);
  };

  // ── Víctimas existentes (encuentro/memorial) ───────────────────────────────

  const toggleVictim = (victimId: string) =>
    setForm((f) => ({
      ...f,
      victims: f.victims.includes(victimId)
        ? f.victims.filter((id) => id !== victimId)
        : [...f.victims, victimId],
    }));

  // ── Validación nueva víctima ───────────────────────────────────────────────

  const validateNewVictim = (): boolean => {
    const errors: Partial<Record<keyof NewVictimForm, string>> = {};
    if (!newVictim.name.trim()) errors.name = "El nombre es requerido.";
    if (!newVictim.dateOfDisappearance)
      errors.dateOfDisappearance = "La fecha es requerida.";
    setNewVictimErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ── Guardar ────────────────────────────────────────────────────────────────

  const handleSave = () => {
    if (!form.name.trim() || !form.description.trim() || !pendingPoint) return;

    let victimIds = [...form.victims];

    if (form.type === "disappearance") {
      if (!validateNewVictim()) return;

      // Crear y almacenar la nueva víctima en el contexto
      const newId = addLocalVictim(newVictim);
      victimIds = [newId];
    }

    addPlace({
      name: form.name,
      type: form.type,
      location: { lat: pendingPoint.lat, lng: pendingPoint.lng },
      description: form.description,
      victims: victimIds,
    });

    resetAll();
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3500);
  };

  const resetAll = () => {
    setPendingPoint(null);
    setFlyTarget(null);
    setShowForm(false);
    setForm({ name: "", type: "memorial", description: "", victims: [] });
    setAddingMode(false);
    setManualLat("");
    setManualLng("");
    setCoordError("");
    setNewVictim(EMPTY_NEW_VICTIM);
    setNewVictimErrors({});
  };

  const isSaveDisabled = () => {
    if (!form.name.trim() || !form.description.trim()) return true;
    if (form.type === "disappearance") {
      return !newVictim.name.trim() || !newVictim.dateOfDisappearance;
    }
    return false;
  };

  // Todas las víctimas disponibles: las del mock + las creadas en sesión
  const allVictims = [
    ...mockVictims,
    ...localVictims.map((v) => ({
      id: v.id,
      name: v.name,
      dateOfDisappearance: v.dateOfDisappearance,
      photo: v.photo,
    })),
  ];

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <p className="text-sm text-gray-500">
          {places.length} lugares registrados
        </p>
        <button
          onClick={() => (addingMode ? resetAll() : setAddingMode(true))}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            addingMode
              ? "bg-red-100 text-red-600 hover:bg-red-200"
              : "bg-[#2E4739] text-white hover:bg-[#3d5a49]"
          }`}
        >
          <MapPin className="w-4 h-4" />
          {addingMode ? "Cancelar" : "Añadir lugar"}
        </button>
      </div>

      {/* Panel de modo */}
      {addingMode && (
        <div className="border border-[#2E4739]/20 rounded-xl bg-[#f7faf8] p-4 space-y-3">
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
            <button
              onClick={() => setCoordMode("map")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                coordMode === "map"
                  ? "bg-white text-[#2E4739] shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <MapPin className="w-3.5 h-3.5" /> Clic en mapa
            </button>
            <button
              onClick={() => setCoordMode("manual")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                coordMode === "manual"
                  ? "bg-white text-[#2E4739] shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Navigation className="w-3.5 h-3.5" /> Coordenadas manuales
            </button>
          </div>

          {coordMode === "map" && !showForm && (
            <p className="text-xs text-gray-400">
              Haz clic en cualquier punto del mapa para colocar el marcador y
              abrir el formulario.
            </p>
          )}

          {coordMode === "manual" && (
            <div className="space-y-2">
              <p className="text-xs text-gray-500">
                Ingresa las coordenadas y presiona <strong>Ir al punto</strong>{" "}
                para previsualizar en el mapa.
              </p>
              <div className="flex gap-2 flex-wrap items-end">
                <div className="flex-1 min-w-[120px]">
                  <label className="block text-xs text-gray-500 mb-1">
                    Latitud
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={manualLat}
                    onChange={(e) => {
                      setManualLat(e.target.value);
                      setCoordError("");
                    }}
                    placeholder="5.41670"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E4739]/30"
                  />
                </div>
                <div className="flex-1 min-w-[120px]">
                  <label className="block text-xs text-gray-500 mb-1">
                    Longitud
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={manualLng}
                    onChange={(e) => {
                      setManualLng(e.target.value);
                      setCoordError("");
                    }}
                    placeholder="-75.01670"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E4739]/30"
                  />
                </div>
                <button
                  onClick={handleManualApply}
                  className="px-4 py-2 bg-[#2E4739] text-white text-sm rounded-lg hover:bg-[#3d5a49] transition"
                >
                  Ir al punto
                </button>
              </div>
              {coordError && (
                <p className="text-xs text-red-500">{coordError}</p>
              )}
              {pendingPoint && !coordError && (
                <p className="text-xs text-[#2E4739] font-medium">
                  ✅ Punto en ({pendingPoint.lat.toFixed(5)},{" "}
                  {pendingPoint.lng.toFixed(5)})
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Mensaje de éxito */}
      {successMsg && (
        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          <Check className="w-4 h-4" />
          Lugar y víctima añadidos correctamente.
        </div>
      )}

      {/* Mapa */}
      <div
        className="relative rounded-xl overflow-hidden border border-gray-200 shadow-sm"
        style={{ height: "460px" }}
      >
        <MapContainer
          center={[5.5, -75.0]}
          zoom={11}
          scrollWheelZoom
          className="w-full h-full"
          style={{
            zIndex: 0,
            cursor: addingMode && coordMode === "map" ? "crosshair" : "grab",
          }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <GeoJSON key="samana" data={samanaData as any} style={samanaStyle} />
          <FitBounds />
          <ClickHandler
            onMapClick={handleMapClick}
            active={addingMode && coordMode === "map"}
          />
          <FlyToPoint point={flyTarget} />

          {places.map((place) => (
            <Marker
              key={place.id}
              position={[place.location.lat, place.location.lng]}
              icon={typeIcons[place.type]}
            />
          ))}
          {pendingPoint && (
            <Marker
              position={[pendingPoint.lat, pendingPoint.lng]}
              icon={pendingIcon}
            />
          )}
        </MapContainer>

        {addingMode && coordMode === "map" && !showForm && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-[#2E4739] text-white text-xs px-3 py-1.5 rounded-full shadow pointer-events-none z-50">
            Haz clic en el mapa para colocar el marcador
          </div>
        )}
      </div>

      {/* Formulario */}
      {showForm && pendingPoint && (
        <div className="border border-[#B2916F]/30 rounded-xl p-5 bg-[#FFFDF8] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg text-[#2E4739]">
              Nuevo lugar de memoria
            </h3>
            <button
              onClick={resetAll}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Coordenadas ajustables */}
          <div className="bg-gray-50 rounded-lg px-3 py-3 space-y-2">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
              Coordenadas del punto
            </p>
            <div className="flex gap-2 flex-wrap">
              <div className="flex-1 min-w-[110px]">
                <label className="block text-xs text-gray-500 mb-1">
                  Latitud
                </label>
                <input
                  type="number"
                  step="any"
                  value={manualLat}
                  onChange={(e) => {
                    setManualLat(e.target.value);
                    const v = parseFloat(e.target.value);
                    if (!isNaN(v) && v >= -90 && v <= 90)
                      setPendingPoint((p) =>
                        p
                          ? { ...p, lat: v }
                          : { lat: v, lng: pendingPoint.lng },
                      );
                  }}
                  className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E4739]/30"
                />
              </div>
              <div className="flex-1 min-w-[110px]">
                <label className="block text-xs text-gray-500 mb-1">
                  Longitud
                </label>
                <input
                  type="number"
                  step="any"
                  value={manualLng}
                  onChange={(e) => {
                    setManualLng(e.target.value);
                    const v = parseFloat(e.target.value);
                    if (!isNaN(v) && v >= -180 && v <= 180)
                      setPendingPoint((p) =>
                        p
                          ? { ...p, lng: v }
                          : { lat: pendingPoint.lat, lng: v },
                      );
                  }}
                  className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E4739]/30"
                />
              </div>
            </div>
            <p className="text-xs text-gray-400">
              Puedes ajustar aquí o hacer clic en otro punto del mapa.
            </p>
          </div>

          <div className="space-y-4">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="Ej. Parque de la Esperanza"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E4739]/30"
              />
            </div>

            {/* Tipo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo *
              </label>
              <select
                value={form.type}
                onChange={(e) => {
                  setForm((f) => ({
                    ...f,
                    type: e.target.value as MemoryPlace["type"],
                    victims: [],
                  }));
                  setNewVictim(EMPTY_NEW_VICTIM);
                  setNewVictimErrors({});
                }}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E4739]/30"
              >
                <option value="disappearance">Desaparición</option>
                <option value="encounter">Encuentro</option>
                <option value="memorial">Memorial</option>
              </select>
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción *
              </label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Describe este lugar de memoria..."
                rows={3}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E4739]/30 resize-none"
              />
            </div>

            {/* ── VÍCTIMAS según tipo ── */}

            {form.type === "disappearance" ? (
              /* ── DESAPARICIÓN: solo crear nueva víctima ── */
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-[#2E4739]" />
                  <label className="text-sm font-medium text-gray-700">
                    Datos de la víctima *
                  </label>
                </div>

                <div className="border border-[#2E4739]/20 rounded-xl p-4 bg-[#f7faf8] space-y-3">
                  {/* Nombre víctima */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Nombre completo *
                    </label>
                    <input
                      type="text"
                      value={newVictim.name}
                      onChange={(e) => {
                        setNewVictim((v) => ({ ...v, name: e.target.value }));
                        if (e.target.value.trim())
                          setNewVictimErrors((er) => ({
                            ...er,
                            name: undefined,
                          }));
                      }}
                      placeholder="Ej. María Lucía Torres"
                      className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E4739]/30 ${
                        newVictimErrors.name
                          ? "border-red-300 bg-red-50"
                          : "border-gray-200"
                      }`}
                    />
                    {newVictimErrors.name && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
                        <AlertCircle className="w-3 h-3" />{" "}
                        {newVictimErrors.name}
                      </p>
                    )}
                  </div>

                  {/* Fecha desaparición */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Fecha de desaparición *
                    </label>
                    <input
                      type="date"
                      value={newVictim.dateOfDisappearance}
                      onChange={(e) => {
                        setNewVictim((v) => ({
                          ...v,
                          dateOfDisappearance: e.target.value,
                        }));
                        if (e.target.value)
                          setNewVictimErrors((er) => ({
                            ...er,
                            dateOfDisappearance: undefined,
                          }));
                      }}
                      className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E4739]/30 ${
                        newVictimErrors.dateOfDisappearance
                          ? "border-red-300 bg-red-50"
                          : "border-gray-200"
                      }`}
                    />
                    {newVictimErrors.dateOfDisappearance && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
                        <AlertCircle className="w-3 h-3" />{" "}
                        {newVictimErrors.dateOfDisappearance}
                      </p>
                    )}
                  </div>

                  {/* Foto (opcional) */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      URL de fotografía{" "}
                      <span className="font-normal text-gray-400">
                        (opcional)
                      </span>
                    </label>
                    <input
                      type="url"
                      value={newVictim.photo}
                      onChange={(e) =>
                        setNewVictim((v) => ({ ...v, photo: e.target.value }))
                      }
                      placeholder="https://ejemplo.com/foto.jpg"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E4739]/30"
                    />
                    {newVictim.photo && (
                      <div className="mt-2 flex items-center gap-2">
                        <img
                          src={newVictim.photo}
                          alt="preview"
                          onError={(e) =>
                            ((e.target as HTMLImageElement).style.display =
                              "none")
                          }
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-[#2E4739]/20 shadow-sm"
                        />
                        <p className="text-xs text-gray-400">Vista previa</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* ── ENCUENTRO / MEMORIAL: seleccionar víctima existente ── */
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Víctimas asociadas{" "}
                  <span className="text-xs text-gray-400 font-normal">
                    (opcional)
                  </span>
                </label>
                <div className="border border-gray-200 rounded-lg overflow-hidden divide-y divide-gray-100 max-h-48 overflow-y-auto">
                  {allVictims.map((victim) => {
                    const selected = form.victims.includes(victim.id);
                    return (
                      <button
                        key={victim.id}
                        type="button"
                        onClick={() => toggleVictim(victim.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                          selected ? "bg-[#2E4739]/5" : "hover:bg-gray-50"
                        }`}
                      >
                        {victim.photo ? (
                          <img
                            src={victim.photo}
                            alt={victim.name}
                            className="w-8 h-8 rounded-full object-cover flex-shrink-0 ring-2 ring-white shadow-sm"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 ring-2 ring-white shadow-sm">
                            <User className="w-4 h-4 text-gray-400" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">
                            {victim.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            Desaparición:{" "}
                            {new Date(
                              victim.dateOfDisappearance,
                            ).toLocaleDateString("es-CO", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                            selected
                              ? "bg-[#2E4739] border-[#2E4739]"
                              : "border-gray-300"
                          }`}
                        >
                          {selected && <Check className="w-3 h-3 text-white" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
                {form.victims.length > 0 && (
                  <p className="mt-2 text-xs text-[#2E4739] font-medium">
                    {form.victims.length} víctima
                    {form.victims.length > 1 ? "s" : ""} seleccionada
                    {form.victims.length > 1 ? "s" : ""}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Acciones */}
          <div className="flex gap-3 justify-end pt-1">
            <button
              onClick={resetAll}
              className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={isSaveDisabled()}
              className="px-4 py-2 text-sm bg-[#2E4739] text-white rounded-lg hover:bg-[#3d5a49] transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Guardar lugar
            </button>
          </div>
        </div>
      )}

      {/* Lista de lugares */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {places.map((place) => (
          <div
            key={place.id}
            className="flex items-center justify-between px-4 py-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{
                  background:
                    place.type === "disappearance"
                      ? "#ef4444"
                      : place.type === "encounter"
                        ? "#2E4739"
                        : "#B2916F",
                }}
              />
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {place.name}
                </p>
                <p className="text-xs text-gray-400">
                  {place.type === "disappearance"
                    ? "Desaparición"
                    : place.type === "encounter"
                      ? "Encuentro"
                      : "Memorial"}{" "}
                  · {place.location.lat.toFixed(4)},{" "}
                  {place.location.lng.toFixed(4)}
                  {place.victims && place.victims.length > 0 && (
                    <span className="ml-1.5 inline-flex items-center gap-0.5 text-[#2E4739]">
                      <User className="w-3 h-3" /> {place.victims.length}
                    </span>
                  )}
                </p>
              </div>
            </div>
            <button
              onClick={() => removePlace(place.id)}
              className="text-gray-300 hover:text-red-400 transition p-1 rounded"
              title="Eliminar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
