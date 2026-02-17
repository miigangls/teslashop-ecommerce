"use server";

import { cookies } from "next/headers";

const AUTH_TOKEN = "auth_token";
const AUTH_ROLE = "auth_role";

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_TOKEN);
  cookieStore.delete(AUTH_ROLE);
}
