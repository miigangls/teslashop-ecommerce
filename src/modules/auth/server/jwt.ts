import { jwtVerify, SignJWT } from "jose";
import { User } from "../infrastructure/auth.types";
import { AUTH_TOKEN_TTL_SECONDS } from "../common/auth.constants";

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("Missing JWT_SECRET env var");
  return new TextEncoder().encode(secret);
}

export async function signAuthToken(user: User) {
  const now = Math.floor(Date.now() / 1000);
  return new SignJWT({ user })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt(now)
    .setExpirationTime(now + AUTH_TOKEN_TTL_SECONDS)
    .sign(getJwtSecret());
}

export async function verifyAuthToken(token: string) {
  const { payload } = await jwtVerify(token, getJwtSecret());
  return payload as unknown as { user: User; iat: number; exp: number };
}
