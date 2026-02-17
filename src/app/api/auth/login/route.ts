import { NextRequest, NextResponse } from "next/server";
import { readPublicJson } from "@/modules/common/server/readPublicJson";
import { signAuthToken } from "@/modules/auth/server/jwt";
import { AUTH_COOKIES } from "@/modules/auth/common/auth.constants";
import { AuthResponse, LoginRequest, User } from "@/modules/auth/infrastructure/auth.types";

type UserRecord = User & { password: string };

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as LoginRequest | null;
  if (!body?.email || !body?.password) {
    return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
  }

  const users = await readPublicJson<UserRecord[]>("data/users.json");
  const userRecord = users.find((u) => u.email.toLowerCase() === body.email.toLowerCase());

  if (!userRecord || userRecord.password !== body.password) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }

  const { password, ...user } = userRecord;
  void password;
  const token = await signAuthToken(user);

  const response = NextResponse.json<AuthResponse>({ user, token });
  response.cookies.set(AUTH_COOKIES.token, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  response.cookies.set(AUTH_COOKIES.role, user.roles.includes("admin") ? "admin" : "user", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  return response;
}
