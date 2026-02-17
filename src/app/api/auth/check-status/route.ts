import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIES } from "@/modules/auth/common/auth.constants";
import { verifyAuthToken } from "@/modules/auth/server/jwt";
import { AuthResponse } from "@/modules/auth/infrastructure/auth.types";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIES.token)?.value;
  if (!token) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const { user } = await verifyAuthToken(token);
    return NextResponse.json<AuthResponse>({ user, token });
  } catch {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
}
