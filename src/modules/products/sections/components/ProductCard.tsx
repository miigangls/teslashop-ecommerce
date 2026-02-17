import Link from "next/link";
import Image from "next/image";
import type { Product } from "../../infrastructure/product.types";
import { currencyFormatter } from "@/lib/currencyFormatter";

interface Props {
  product: Product;
}

export function ProductCard({ product }: Props) {
  const image = product.images[0] ?? "https://placehold.co/800x800/png?text=Teslo+Shop";
  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block overflow-hidden rounded-lg border bg-background transition-colors hover:bg-muted/40"
    >
      <div className="aspect-square w-full overflow-hidden bg-muted">
        <Image
          src={image}
          alt={product.title}
          width={800}
          height={800}
          unoptimized
          className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
        />
      </div>
      <div className="space-y-1 p-3">
        <div className="line-clamp-1 text-sm font-medium">{product.title}</div>
        <div className="text-sm text-muted-foreground">
          {currencyFormatter.format(product.price)}
        </div>
        <div className="line-clamp-1 text-xs text-muted-foreground">
          {product.gender} · Stock {product.stock}
        </div>
      </div>
    </Link>
  );
}

