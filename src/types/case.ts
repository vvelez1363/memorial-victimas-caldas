export type CasePriority = "Alta" | "Media" | "Baja";
export type CaseStatus = "Pendiente" | "En Revisión" | "Aprobado" | "Archivado";

export interface CaseRecord {
  id: string;
  trackingCode: string;
  reporter: string;
  email: string;
  phone?: string;
  relationship: string;
  municipality: string;
  victimName?: string;
  details: string;
  reportDate: string;
  status: CaseStatus;
  priority: CasePriority;
}

export interface CreateCaseInput {
  reporter: string;
  email: string;
  phone?: string;
  relationship: string;
  municipality: string;
  victimName?: string;
  details: string;
}
