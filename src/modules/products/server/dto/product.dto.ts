import type { Product, ProductGender, ProductSize } from "../../infrastructure/product.types";

export interface ProductUpsertDto {
  title: string;
  price: number;
  description: string;
  slug: string;
  stock: number;
  sizes: ProductSize[];
  gender: ProductGender;
  tags: string[];
  images: string[];
}

export function normalizeProductUpsertDto(input: ProductUpsertDto): ProductUpsertDto {
  return {
    ...input,
    title: input.title.trim(),
    description: input.description.trim(),
    slug: input.slug.trim().toLowerCase(),
    tags: input.tags.map((t) => t.trim()).filter(Boolean),
    images: input.images.map((img) => img.trim()).filter(Boolean),
  };
}

export function toProductFromUpsertDto(id: string, dto: ProductUpsertDto): Product {
  return { id, ...dto };
}

