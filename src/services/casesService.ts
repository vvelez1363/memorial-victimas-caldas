import { initialCases } from "@/data/cases-data";
import type { CaseRecord, CaseStatus, CreateCaseInput } from "@/types/case";
import { STORAGE_KEYS } from "@/utils/constants";
import { createTrackingCode } from "@/utils/helpers";

let casesCache: CaseRecord[] = [...initialCases];

function getPersistedCases(): CaseRecord[] {
  if (typeof window === "undefined") {
    return casesCache;
  }

  const value = localStorage.getItem(STORAGE_KEYS.CASES);
  if (!value) {
    localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(casesCache));
    return casesCache;
  }

  try {
    casesCache = JSON.parse(value) as CaseRecord[];
    return casesCache;
  } catch {
    localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(casesCache));
    return casesCache;
  }
}

function persistCases(nextCases: CaseRecord[]): void {
  casesCache = nextCases;
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(nextCases));
  }
}

function inferPriority(details: string): "Alta" | "Media" | "Baja" {
  if (details.length > 500) {
    return "Alta";
  }

  if (details.length > 180) {
    return "Media";
  }

  return "Baja";
}

export async function getCases(): Promise<CaseRecord[]> {
  return getPersistedCases();
}

export async function createCase(input: CreateCaseInput): Promise<CaseRecord> {
  const nextCase: CaseRecord = {
    id: crypto.randomUUID(),
    trackingCode: createTrackingCode(),
    reporter: input.reporter,
    email: input.email,
    phone: input.phone,
    relationship: input.relationship,
    municipality: input.municipality,
    victimName: input.victimName,
    details: input.details,
    reportDate: new Date().toISOString().slice(0, 10),
    status: "Pendiente",
    priority: inferPriority(input.details),
  };

  const current = getPersistedCases();
  persistCases([nextCase, ...current]);
  return nextCase;
}

export async function updateCaseStatus(
  id: string,
  status: CaseStatus,
): Promise<CaseRecord | null> {
  const current = getPersistedCases();
  const index = current.findIndex((item) => item.id === id);

  if (index === -1) {
    return null;
  }

  const next = [...current];
  next[index] = { ...next[index], status };
  persistCases(next);
  return next[index];
}

export async function deleteCase(id: string): Promise<boolean> {
  const current = getPersistedCases();
  const next = current.filter((item) => item.id !== id);

  if (next.length === current.length) {
    return false;
  }

  persistCases(next);
  return true;
}
