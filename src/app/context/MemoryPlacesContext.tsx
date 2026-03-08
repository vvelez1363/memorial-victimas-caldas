// src/app/context/MemoryPlacesContext.tsx

import { createContext, useContext, useState, ReactNode } from "react";
import { mockMemoryPlaces, mockVictims } from "../data/mock-data";
import type { MemoryPlace } from "../data/mock-data";

interface LocalVictim {
  id: string;
  name: string;
  dateOfDisappearance: string;
  photo: string;
}

interface MemoryPlacesContextType {
  places: MemoryPlace[];
  addPlace: (place: Omit<MemoryPlace, "id">) => void;
  removePlace: (id: string) => void;
  localVictims: LocalVictim[];
  addLocalVictim: (victim: Omit<LocalVictim, "id">) => string;
}

const MemoryPlacesContext = createContext<MemoryPlacesContextType | null>(null);

export function MemoryPlacesProvider({ children }: { children: ReactNode }) {
  const [places, setPlaces] = useState<MemoryPlace[]>(mockMemoryPlaces);
  const [localVictims, setLocalVictims] = useState<LocalVictim[]>([]);

  const addPlace = (place: Omit<MemoryPlace, "id">) => {
    setPlaces((prev) => [...prev, { ...place, id: `custom-${Date.now()}` }]);
  };

  const removePlace = (id: string) => {
    setPlaces((prev) => prev.filter((p) => p.id !== id));
  };

  const addLocalVictim = (victim: Omit<LocalVictim, "id">): string => {
    const id = `victim-local-${Date.now()}`;
    setLocalVictims((prev) => [...prev, { id, ...victim }]);
    return id;
  };

  return (
    <MemoryPlacesContext.Provider
      value={{ places, addPlace, removePlace, localVictims, addLocalVictim }}
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
