/* eslint-disable jsx-a11y/role-supports-aria-props */
"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/modules/auth/sections/hooks/useAuth";

const genderLinks = [
  { href: "/", label: "Todos" },
  { href: "/gender/men", label: "Hombres" },
  { href: "/gender/women", label: "Mujeres" },
  { href: "/gender/kid", label: "Ninos" },
];

export function ShopHeader() {
  const { status, role, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialQuery = useMemo(() => searchParams.get("query") ?? "", [searchParams]);
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    const next = searchParams.get("query") ?? "";
    setQuery(next);
  }, [searchParams]);

  const onSubmitSearch = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (query.trim()) params.set("query", query.trim());
    else params.delete("query");
    params.delete("page");
    router.replace(`${pathname}?${params.toString()}`);
  }, [pathname, query, router, searchParams]);

  return (
    <header className="border-b border-border">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-semibold tracking-tight">
          Tesla Shop
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          {genderLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden w-full max-w-xs px-4 md:block">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSubmitSearch();
            }}
            placeholder="Buscar..."
            aria-label="Buscar productos"
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <div className="flex items-center gap-2">
          {status !== "authenticated" ? (
            <Link href="/auth/login" className="text-sm hover:underline">
              Login
            </Link>
          ) : (
            <button onClick={() => logout()} className="text-sm hover:underline">
              Cerrar sesion
            </button>
          )}
          {role === "admin" ? (
            <Link href="/admin" className="text-sm hover:underline">
              Admin
            </Link>
          ) : null}
        </div>
      </div>
    </header>
  );
}
