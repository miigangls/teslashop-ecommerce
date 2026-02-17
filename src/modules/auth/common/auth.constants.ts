export const AUTH_COOKIES = {
  token: "auth_token",
  role: "auth_role",
} as const;

export const AUTH_TOKEN_TTL_SECONDS = 60 * 60 * 2; // 2h
