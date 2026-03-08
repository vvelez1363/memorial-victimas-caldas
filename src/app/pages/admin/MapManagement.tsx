// src/app/pages/admin/MapManagement.tsx

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { AdminMemoryMap } from "@/app/components/maps/AdminMemoryMap";
import { useMemoryPlaces } from "@/app/context/MemoryPlacesContext";

export function MapManagement() {
  const { places } = useMemoryPlaces();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-display text-[#1a1a1a]">
          Mapa de Memoria
        </h2>
        <p className="text-gray-600 mt-1">
          Gestiona los lugares de memoria. Los cambios se reflejan en toda la
          app.
        </p>
      </div>

      {/* Stats dinámicos */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-[#1a1a1a]">
              {places.length}
            </div>
            <p className="text-sm text-gray-600">Total registrados</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-500">
              {places.filter((p) => p.type === "disappearance").length}
            </div>
            <p className="text-sm text-gray-600">Desapariciones</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-[#2E4739]">
              {places.filter((p) => p.type === "encounter").length}
            </div>
            <p className="text-sm text-gray-600">Encuentros</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-[#B2916F]">
              {places.filter((p) => p.type === "memorial").length}
            </div>
            <p className="text-sm text-gray-600">Memoriales</p>
          </CardContent>
        </Card>
      </div>

      {/* Mapa interactivo */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-[#2E4739]">
            Mapa Interactivo
          </CardTitle>
          <p className="text-sm text-gray-500">
            Activa "Añadir lugar" y haz clic en el mapa para registrar un nuevo
            punto.
          </p>
        </CardHeader>
        <CardContent>
          <AdminMemoryMap />
        </CardContent>
      </Card>

      {/* Lista de lugares */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-[#2E4739]">
            Lugares Registrados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {places.map((place) => (
              <div
                key={place.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background:
                        place.type === "disappearance"
                          ? "#ef444422"
                          : place.type === "encounter"
                            ? "#2E473922"
                            : "#B2916F22",
                    }}
                  >
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{
                        background:
                          place.type === "disappearance"
                            ? "#ef4444"
                            : place.type === "encounter"
                              ? "#2E4739"
                              : "#B2916F",
                      }}
                    />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-800">
                      {place.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {place.type === "disappearance"
                        ? "Desaparición"
                        : place.type === "encounter"
                          ? "Encuentro"
                          : "Memorial"}{" "}
                      · {place.location.lat.toFixed(4)},{" "}
                      {place.location.lng.toFixed(4)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-700">
                    {place.victims?.length ?? 0}
                  </p>
                  <p className="text-xs text-gray-500">víctimas</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
