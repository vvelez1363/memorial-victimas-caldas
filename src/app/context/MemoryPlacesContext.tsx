// src/app/context/MemoryPlacesContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";
import { mockMemoryPlaces, mockVictims } from "../data/mock-data";
import type { MemoryPlace } from "../data/mock-data";

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface Victim {
  id: string;
  name: string;
  dateOfDisappearance: string; // "YYYY-MM-DD"
  photo: boolean;
  photoUrl: string | null;
  age: number | null;
  location: string; // descripción textual, ya no coordenadas aquí
  familyContact: string;
  phone: string;
  notes: string;
  status: "Documentado" | "En investigación";
}

interface MemoryPlacesContextType {
  // ── Lugares ──
  places: MemoryPlace[];
  addPlace: (place: Omit<MemoryPlace, "id">) => void;
  removePlace: (id: string) => void;

  // ── Víctimas ──
  victims: Victim[];
  addVictim: (victim: Omit<Victim, "id">) => string;
  updateVictim: (id: string, updates: Partial<Omit<Victim, "id">>) => void;
  deleteVictim: (id: string) => void;

  // ── Retrocompat: AdminMemoryMap usa allVictims para su selector ──
  // Expone el listado combinado en el formato que ya usa el mapa
  allVictimsForMap: {
    id: string;
    name: string;
    dateOfDisappearance: string;
    photo: string;
  }[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Convierte mockVictims (formato mock-data) al formato Victim del contexto.
 * Solo se ejecuta una vez al inicializar el provider.
 */
function mockToVictim(mv: (typeof mockVictims)[number]): Victim {
  return {
    id: mv.id,
    name: mv.name,
    dateOfDisappearance: mv.dateOfDisappearance,
    photo: !!mv.photo,
    photoUrl: mv.photo || null,
    age: null,
    location: "",
    familyContact: "",
    phone: "",
    notes: "",
    status: "Documentado",
  };
}

// ─── Contexto ─────────────────────────────────────────────────────────────────

const MemoryPlacesContext = createContext<MemoryPlacesContextType | null>(null);

export function MemoryPlacesProvider({ children }: { children: ReactNode }) {
  const [places, setPlaces] = useState<MemoryPlace[]>(mockMemoryPlaces);
  const [victims, setVictims] = useState<Victim[]>(
    mockVictims.map(mockToVictim),
  );

  // ── Lugares ──────────────────────────────────────────────────────────────

  const addPlace = (place: Omit<MemoryPlace, "id">) => {
    setPlaces((prev) => [...prev, { ...place, id: `custom-${Date.now()}` }]);
  };

  const removePlace = (id: string) => {
    setPlaces((prev) => prev.filter((p) => p.id !== id));
  };

  // ── Víctimas ─────────────────────────────────────────────────────────────

  const addVictim = (victim: Omit<Victim, "id">): string => {
    const id = `victim-${Date.now()}`;
    setVictims((prev) => [...prev, { id, ...victim }]);
    return id;
  };

  const updateVictim = (id: string, updates: Partial<Omit<Victim, "id">>) => {
    setVictims((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...updates } : v)),
    );
  };

  const deleteVictim = (id: string) => {
    setVictims((prev) => prev.filter((v) => v.id !== id));
  };

  // ── Vista para el mapa (formato que ya usa AdminMemoryMap) ────────────────

  const allVictimsForMap = victims.map((v) => ({
    id: v.id,
    name: v.name,
    dateOfDisappearance: v.dateOfDisappearance,
    photo: v.photoUrl ?? "",
  }));

  return (
    <MemoryPlacesContext.Provider
      value={{
        places,
        addPlace,
        removePlace,
        victims,
        addVictim,
        updateVictim,
        deleteVictim,
        allVictimsForMap,
      }}
    >
      {children}
    </MemoryPlacesContext.Provider>
  );
}

export function useMemoryPlaces() {
  const ctx = useContext(MemoryPlacesContext);
  if (!ctx)
    throw new Error(
      "useMemoryPlaces debe usarse dentro de MemoryPlacesProvider",
    );
  return ctx;
}
