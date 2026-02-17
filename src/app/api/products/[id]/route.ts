import { NextRequest, NextResponse } from "next/server";
import type { Product } from "@/modules/products/infrastructure/product.types";
import { readProductsJson, writeProductsJson } from "@/modules/products/server/persistence/productsJson";
import {
  normalizeProductUpsertDto,
  type ProductUpsertDto,
} from "@/modules/products/server/dto/product.dto";

export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const products = await readProductsJson();
  const product = products.find((p) => p.id === id || p.slug === id);

  if (!product) {
    return NextResponse.json({ message: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const body = (await request.json().catch(() => null)) as ProductUpsertDto | null;
  if (!body) return NextResponse.json({ message: "Invalid body" }, { status: 400 });

  const dto = normalizeProductUpsertDto(body);
  const products = await readProductsJson();
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return NextResponse.json({ message: "Product not found" }, { status: 404 });

  const slugTaken = products.some((p) => p.slug === dto.slug && p.id !== id);
  if (slugTaken) {
    return NextResponse.json({ message: "Slug already exists" }, { status: 409 });
  }

  const updated: Product = { id, ...dto };
  const next = [...products];
  next[idx] = updated;
  await writeProductsJson(next);

  return NextResponse.json(updated);
}
