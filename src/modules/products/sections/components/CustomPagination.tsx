"use client";

import { useAtom } from "jotai";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { pageAtom } from "../../state/filters.atoms";
import { cn } from "@/lib/utils";

interface Props {
  pages: number;
}

export function CustomPagination({ pages }: Props) {
  const [page, setPage] = useAtom(pageAtom);

  if (pages <= 1) return null;

  const safePage = Math.min(Math.max(1, page), pages);
  const numbers = Array.from({ length: pages }, (_, idx) => idx + 1);

  return (
    <nav aria-label="Paginación" className="flex flex-wrap items-center justify-center gap-2 pt-4">
      <button
        type="button"
        onClick={() => setPage(Math.max(1, safePage - 1))}
        className={cn(
          "inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm",
          safePage === 1 ? "pointer-events-none opacity-50" : "hover:bg-muted",
        )}
      >
        <ChevronLeft className="h-4 w-4" />
        Anterior
      </button>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {numbers.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setPage(n)}
            className={cn(
              "h-9 min-w-9 rounded-md border px-3 text-sm",
              n === safePage
                ? "border-foreground bg-foreground text-background"
                : "border-input hover:bg-muted",
            )}
          >
            {n}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setPage(Math.min(pages, safePage + 1))}
        className={cn(
          "inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm",
          safePage === pages ? "pointer-events-none opacity-50" : "hover:bg-muted",
        )}
      >
        Siguiente
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
