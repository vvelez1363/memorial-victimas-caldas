import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createCase,
  deleteCase,
  getCases,
  updateCaseStatus,
} from "@/services/casesService";
import type { CaseRecord, CaseStatus, CreateCaseInput } from "@/types/case";

export function useCases() {
  const [cases, setCases] = useState<CaseRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await getCases();
      setCases(list);
    } catch {
      setError("No se pudieron cargar los casos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const stats = useMemo(() => {
    return {
      pending: cases.filter((item) => item.status === "Pendiente").length,
      inReview: cases.filter((item) => item.status === "En Revisión").length,
      approved: cases.filter((item) => item.status === "Aprobado").length,
      archived: cases.filter((item) => item.status === "Archivado").length,
    };
  }, [cases]);

  const addCase = useCallback(async (input: CreateCaseInput) => {
    const created = await createCase(input);
    setCases((prev) => [created, ...prev]);
    return created;
  }, []);

  const changeStatus = useCallback(async (id: string, status: CaseStatus) => {
    const updated = await updateCaseStatus(id, status);
    if (!updated) {
      return null;
    }

    setCases((prev) => prev.map((item) => (item.id === id ? updated : item)));
    return updated;
  }, []);

  const removeCase = useCallback(async (id: string) => {
    const deleted = await deleteCase(id);
    if (deleted) {
      setCases((prev) => prev.filter((item) => item.id !== id));
    }
    return deleted;
  }, []);

  return {
    cases,
    loading,
    error,
    stats,
    refresh,
    addCase,
    changeStatus,
    removeCase,
  };
}
