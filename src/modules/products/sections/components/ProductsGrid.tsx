"use client";

import { useAtom } from "jotai";
import { Filter, Grid2X2, List } from "lucide-react";
import type { Product } from "../../infrastructure/product.types";
import { viewModeAtom } from "../../state/filters.atoms";
import { productsSidebarOpenAtom } from "../../state/ui.atoms";
import { ProductCard } from "./ProductCard";
import { cn } from "@/lib/utils";

interface Props {
  products: Product[];
  totalCount: number;
  title?: string;
}

export function ProductsGrid({ products, totalCount, title = "Productos" }: Props) {
  const [viewMode, setViewMode] = useAtom(viewModeAtom);
  const [sidebarOpen, setSidebarOpen] = useAtom(productsSidebarOpenAtom);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="text-sm text-muted-foreground">({totalCount} productos)</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-muted lg:hidden"
          >
            <Filter className="h-4 w-4" />
            Filtros
          </button>

          <div className="hidden overflow-hidden rounded-md border md:flex">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={cn(
                "px-3 py-2 text-sm",
                viewMode === "grid" ? "bg-foreground text-background" : "hover:bg-muted",
              )}
              aria-label="Vista en grilla"
            >
              <Grid2X2 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={cn(
                "px-3 py-2 text-sm",
                viewMode === "list" ? "bg-foreground text-background" : "hover:bg-muted",
              )}
              aria-label="Vista en lista"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div
        className={cn(
          viewMode === "grid"
            ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            : "space-y-3",
        )}
      >
        {products.map((product) => (
          <div key={product.id} className={cn(viewMode === "list" && "max-w-3xl")}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
