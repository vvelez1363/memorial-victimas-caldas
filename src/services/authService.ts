import { adminUsers } from "@/data/admin-data";
import type { AuthUser, LoginPayload } from "@/types/auth";
import { ADMIN_CREDENTIALS, STORAGE_KEYS } from "@/utils/constants";

function delay(ms = 250) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function loginAdmin(
  payload: LoginPayload,
): Promise<AuthUser | null> {
  await delay();

  const isValid =
    payload.email === ADMIN_CREDENTIALS.email &&
    payload.password === ADMIN_CREDENTIALS.password;

  if (!isValid) {
    return null;
  }

  return adminUsers[0] ?? null;
}

export function saveSession(user: AuthUser): void {
  localStorage.setItem(STORAGE_KEYS.ADMIN_USER, JSON.stringify(user));
}

export function getSession(): AuthUser | null {
  const value = localStorage.getItem(STORAGE_KEYS.ADMIN_USER);
  return value ? (JSON.parse(value) as AuthUser) : null;
}

export function clearSession(): void {
  localStorage.removeItem(STORAGE_KEYS.ADMIN_USER);
}
