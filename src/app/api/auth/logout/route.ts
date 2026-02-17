import { NextResponse } from "next/server";
import { AUTH_COOKIES } from "@/modules/auth/common/auth.constants";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete(AUTH_COOKIES.token);
  response.cookies.delete(AUTH_COOKIES.role);
  return response;
}
