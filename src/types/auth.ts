export type AdminRole = "admin" | "editor" | "moderator";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
}

export interface LoginPayload {
  email: string;
  password: string;
}
