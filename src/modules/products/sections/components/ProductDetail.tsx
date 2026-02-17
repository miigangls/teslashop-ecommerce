"use client";

import Image from "next/image";
import { useProduct } from "../hooks/useProduct";
import { currencyFormatter } from "@/lib/currencyFormatter";

interface Props {
  idOrSlug: string;
}

export function ProductDetail({ idOrSlug }: Props) {
  const query = useProduct(idOrSlug);

  if (query.isPending) {
    return (
      <section className="rounded-lg border bg-background p-6 text-sm text-muted-foreground">
        Cargando producto...
      </section>
    );
  }

  if (query.isError) {
    return (
      <section className="rounded-lg border bg-background p-6 text-sm">
        <div className="font-medium">No se pudo cargar el producto</div>
        <div className="mt-1 text-muted-foreground">
          {query.error instanceof Error ? query.error.message : "Error desconocido"}
        </div>
      </section>
    );
  }

  const product = query.data;
  if (!product) {
    return (
      <section className="rounded-lg border bg-background p-6 text-sm text-muted-foreground">
        Producto no encontrado.
      </section>
    );
  }

  return (
    <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="overflow-hidden rounded-lg border bg-muted">
        <Image
          src={product.images[0] ?? "https://placehold.co/800x800/png?text=Teslo+Shop"}
          alt={product.title}
          width={800}
          height={800}
          unoptimized
          className="h-full w-full object-cover"
        />
      </div>

      <div className="space-y-3">
        <h1 className="text-2xl font-semibold tracking-tight">{product.title}</h1>
        <div className="text-lg">{currencyFormatter.format(product.price)}</div>
        <p className="text-sm text-muted-foreground">{product.description}</p>

        <div className="text-sm">
          <div>
            <span className="font-medium">Género:</span> {product.gender}
          </div>
          <div>
            <span className="font-medium">Stock:</span> {product.stock}
          </div>
          <div className="mt-2">
            <span className="font-medium">Tallas:</span>{" "}
            <span className="text-muted-foreground">{product.sizes.join(", ")}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

