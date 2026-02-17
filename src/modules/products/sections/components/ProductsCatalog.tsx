"use client";

import { useAtom } from "jotai";
import { X } from "lucide-react";
import { useProducts } from "../hooks/useProducts";
import { useProductFiltersUrl } from "../hooks/useProductFiltersUrl";
import { productsSidebarOpenAtom } from "../../state/ui.atoms";
import { FilterSidebar } from "./FilterSidebar";
import { ProductsGrid } from "./ProductsGrid";
import { CustomPagination } from "./CustomPagination";

interface Props {
  gender?: string;
  title?: string;
}

export function ProductsCatalog({ gender, title }: Props) {
  useProductFiltersUrl();
  const [sidebarOpen, setSidebarOpen] = useAtom(productsSidebarOpenAtom);

  const query = useProducts({ gender });

  if (query.isPending) {
    return (
      <section className="rounded-lg border bg-background p-6 text-sm text-muted-foreground">
        Cargando productos...
      </section>
    );
  }

  if (query.isError) {
    return (
      <section className="rounded-lg border bg-background p-6 text-sm">
        <div className="font-medium">No se pudieron cargar los productos</div>
        <div className="mt-1 text-muted-foreground">
          {query.error instanceof Error ? query.error.message : "Error desconocido"}
        </div>
      </section>
    );
  }

  const data = query.data;
  if (!data) {
    return (
      <section className="rounded-lg border bg-background p-6 text-sm text-muted-foreground">
        Sin datos.
      </section>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
      <div className="hidden lg:block">
        <FilterSidebar />
      </div>

      {sidebarOpen ? (
        <div className="fixed inset-0 z-50 bg-background p-4 lg:hidden">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm font-semibold">Filtros</div>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-muted"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
              Cerrar
            </button>
          </div>
          <FilterSidebar />
        </div>
      ) : null}

      <div>
        <ProductsGrid products={data.products} totalCount={data.count} title={title} />
        <CustomPagination pages={data.pages} />
      </div>
    </div>
  );
}

