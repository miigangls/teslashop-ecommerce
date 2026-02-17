"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAdminProducts } from "../hooks/useAdminProducts";
import { currencyFormatter } from "@/lib/currencyFormatter";

function parsePage(value: string | null) {
  const n = Number(value ?? 1);
  if (Number.isNaN(n) || n < 1) return 1;
  return Math.floor(n);
}

export function AdminProductsTable() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = useMemo(() => parsePage(searchParams.get("page")), [searchParams]);
  const queryParam = searchParams.get("query") ?? "";

  const [query, setQuery] = useState(queryParam);

  const productsQuery = useAdminProducts({
    page,
    query: queryParam.trim() ? queryParam.trim() : undefined,
  });

  const onSubmitSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (query.trim()) params.set("query", query.trim());
    else params.delete("query");
    params.delete("page");
    router.replace(`/admin/products?${params.toString()}`);
  };

  if (productsQuery.isPending) {
    return (
      <section className="rounded-lg border bg-background p-6 text-sm text-muted-foreground">
        Cargando productos...
      </section>
    );
  }

  if (productsQuery.isError) {
    return (
      <section className="rounded-lg border bg-background p-6 text-sm">
        <div className="font-medium">No se pudieron cargar los productos</div>
        <div className="mt-1 text-muted-foreground">
          {productsQuery.error instanceof Error
            ? productsQuery.error.message
            : "Error desconocido"}
        </div>
      </section>
    );
  }

  const data = productsQuery.data;

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Productos</h2>
          <p className="text-sm text-muted-foreground">{data.count} total</p>
        </div>

        <div className="flex gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSubmitSearch();
            }}
            placeholder="Buscar por título o tags..."
            aria-label="Buscar productos"
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring md:w-80"
          />
          <button
            type="button"
            onClick={onSubmitSearch}
            className="h-9 rounded-md border px-3 text-sm hover:bg-muted"
          >
            Buscar
          </button>
          <Link
            href="/admin/products/new"
            className="h-9 rounded-md border px-3 text-sm leading-9 hover:bg-muted"
          >
            Nuevo
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Producto</th>
              <th className="px-4 py-3">Precio</th>
              <th className="px-4 py-3">Género</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Tallas</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {data.products.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="px-4 py-3">
                  <div className="font-medium">{p.title}</div>
                  <div className="text-xs text-muted-foreground">{p.slug}</div>
                </td>
                <td className="px-4 py-3">{currencyFormatter.format(p.price)}</td>
                <td className="px-4 py-3">{p.gender}</td>
                <td className="px-4 py-3">{p.stock}</td>
                <td className="px-4 py-3">{p.sizes.join(", ")}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/products/${p.id}`} className="text-sm hover:underline">
                    Editar
                  </Link>
                </td>
              </tr>
            ))}

            {data.products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">
                  Sin resultados.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {data.pages > 1 ? (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            type="button"
            onClick={() => {
              const params = new URLSearchParams(searchParams.toString());
              const next = Math.max(1, page - 1);
              if (next === 1) params.delete("page");
              else params.set("page", String(next));
              router.replace(`/admin/products?${params.toString()}`);
            }}
            className="h-9 rounded-md border px-3 text-sm hover:bg-muted disabled:opacity-50"
            disabled={page <= 1}
          >
            Anterior
          </button>
          <div className="text-sm text-muted-foreground">
            Página {page} de {data.pages}
          </div>
          <button
            type="button"
            onClick={() => {
              const params = new URLSearchParams(searchParams.toString());
              const next = Math.min(data.pages, page + 1);
              params.set("page", String(next));
              router.replace(`/admin/products?${params.toString()}`);
            }}
            className="h-9 rounded-md border px-3 text-sm hover:bg-muted disabled:opacity-50"
            disabled={page >= data.pages}
          >
            Siguiente
          </button>
        </div>
      ) : null}
    </section>
  );
}

