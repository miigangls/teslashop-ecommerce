"use client";

import { useAtom } from "jotai";
import { priceAtom, sizesAtom } from "../../state/filters.atoms";
import type { PriceFilter, ProductSize } from "../../infrastructure/product.types";
import { cn } from "@/lib/utils";

const SIZES: { id: ProductSize; label: string }[] = [
  { id: "XS", label: "XS" },
  { id: "S", label: "S" },
  { id: "M", label: "M" },
  { id: "L", label: "L" },
  { id: "XL", label: "XL" },
  { id: "XXL", label: "XXL" },
];

const PRICES: { id: PriceFilter; label: string }[] = [
  { id: "any", label: "Cualquier precio" },
  { id: "0-50", label: "$0 - $50" },
  { id: "50-100", label: "$50 - $100" },
  { id: "100-200", label: "$100 - $200" },
  { id: "200+", label: "$200+" },
];

export function FilterSidebar() {
  const [sizes, setSizes] = useAtom(sizesAtom);
  const [price, setPrice] = useAtom(priceAtom);

  const toggleSize = (size: ProductSize) => {
    setSizes((prev) => (prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]));
  };

  return (
    <aside className="w-full space-y-6 rounded-lg border bg-background p-4">
      <div>
        <div className="text-sm font-semibold">Filtros</div>
        <div className="mt-1 text-xs text-muted-foreground">
          Cambiar un filtro reinicia a la página 1.
        </div>
      </div>

      <div className="space-y-3">
        <div className="text-sm font-medium">Tallas</div>
        <div className="grid grid-cols-3 gap-2">
          {SIZES.map((size) => {
            const active = sizes.includes(size.id);
            return (
              <button
                key={size.id}
                type="button"
                onClick={() => toggleSize(size.id)}
                className={cn(
                  "h-9 rounded-md border px-2 text-xs transition-colors",
                  active
                    ? "border-foreground bg-foreground text-background"
                    : "border-input bg-background hover:bg-muted",
                )}
              >
                {size.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <div className="text-sm font-medium">Precio</div>
        <div className="space-y-2">
          {PRICES.map((item) => (
            <label
              key={item.id}
              className="flex cursor-pointer items-center gap-2 text-sm"
            >
              <input
                type="radio"
                name="price"
                value={item.id}
                checked={price === item.id}
                onChange={() => setPrice(item.id)}
              />
              <span className="text-sm">{item.label}</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}
