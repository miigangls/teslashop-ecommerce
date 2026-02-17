const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
export const NEXT_API_URL = `${APP_URL}/api`;

export const API_ENDPOINTS = {
  auth: {
    login: "/auth/login",
    checkStatus: "/auth/check-status",
  },
  products: "/products",
  filesProduct: "/files/product",
} as const;

export const APP_ROLES = {
  admin: "admin",
  user: "user",
} as const;
