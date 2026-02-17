import { AuthResponse, LoginRequest } from "../../infrastructure/auth.types";

export async function authApiLogin(payload: LoginRequest) {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "include",
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data?.message ?? "Login failed");
  return data as AuthResponse;
}

export async function authApiCheckStatus() {
  const response = await fetch("/api/auth/check-status", {
    cache: "no-store",
    credentials: "include",
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data?.message ?? "Not authenticated");
  return data as AuthResponse;
}

export async function authApiLogout() {
  await fetch("/api/auth/logout", { method: "POST", credentials: "include" }).catch(
    () => null,
  );
}
