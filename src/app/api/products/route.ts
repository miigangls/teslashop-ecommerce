import { NextRequest, NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import type {
  PriceFilter,
  Product,
  ProductGender,
  ProductSize,
  ProductsResponse,
} from "@/modules/products/infrastructure/product.types";
import { parsePriceFilter } from "@/modules/products/utils/priceRange";
import { randomUUID } from "node:crypto";
import { readProductsJson, writeProductsJson } from "@/modules/products/server/persistence/productsJson";
import {
  normalizeProductUpsertDto,
  toProductFromUpsertDto,
  type ProductUpsertDto,
} from "@/modules/products/server/dto/product.dto";

const PRODUCTS_FILE = path.join(process.cwd(), "public", "data", "products.json");

async function readProductsFile(): Promise<Product[]> {
  const raw = await readFile(PRODUCTS_FILE, "utf-8");
  const data = JSON.parse(raw) as unknown;
  return Array.isArray(data) ? (data as Product[]) : [];
}

function parseCsvSizes(value: string | null): ProductSize[] | undefined {
  if (!value) return undefined;
  const normalized = value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => s.toUpperCase());
  const valid: ProductSize[] = ["XS", "S", "M", "L", "XL", "XXL"];
  const parsed = normalized.filter((s): s is ProductSize => valid.includes(s as ProductSize));
  return parsed.length ? parsed : undefined;
}

function parseNumber(value: string | null) {
  if (!value) return undefined;
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return undefined;
  return parsed;
}

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;

  const limitFromQuery = parseNumber(sp.get("limit"));
  const limit =
    typeof limitFromQuery === "number" && limitFromQuery >= 1
      ? Math.floor(limitFromQuery)
      : 9;
  const offsetFromQuery = parseNumber(sp.get("offset"));
  const pageFromQuery = parseNumber(sp.get("page"));
  const offset =
    typeof offsetFromQuery === "number" && offsetFromQuery >= 0
      ? Math.floor(offsetFromQuery)
      : typeof pageFromQuery === "number" && pageFromQuery >= 1
        ? (Math.floor(pageFromQuery) - 1) * limit
        : 0;

  const genderRaw = sp.get("gender")?.trim();
  const gender = genderRaw ? (genderRaw as ProductGender) : undefined;

  const sizes = parseCsvSizes(sp.get("sizes"));

  const q = (sp.get("q") ?? sp.get("query") ?? "").trim().toLowerCase();

  const minPriceRaw = parseNumber(sp.get("minPrice"));
  const maxPriceRaw = parseNumber(sp.get("maxPrice"));

  const priceRaw = sp.get("price") as PriceFilter | null;
  const priceRange = priceRaw ? parsePriceFilter(priceRaw) : {};
  const minPrice = typeof minPriceRaw === "number" ? minPriceRaw : priceRange.minPrice;
  const maxPrice = typeof maxPriceRaw === "number" ? maxPriceRaw : priceRange.maxPrice;

  const allProducts = await readProductsFile();

  const filtered = allProducts.filter((product) => {
    if (gender && product.gender !== gender) return false;

    if (sizes && sizes.length > 0) {
      const matches = sizes.some((size) => product.sizes.includes(size));
      if (!matches) return false;
    }

    if (typeof minPrice === "number" && product.price < minPrice) return false;
    if (typeof maxPrice === "number" && product.price > maxPrice) return false;

    if (q) {
      const haystack = `${product.title} ${product.description} ${product.tags.join(" ")}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }

    return true;
  });

  const count = filtered.length;
  const pages = Math.max(1, Math.ceil(count / limit));
  const products = filtered.slice(offset, offset + limit);

  const response: ProductsResponse = { count, pages, products };
  return NextResponse.json(response);
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as ProductUpsertDto | null;
  if (!body) return NextResponse.json({ message: "Invalid body" }, { status: 400 });

  const dto = normalizeProductUpsertDto(body);
  if (!dto.title || !dto.slug) {
    return NextResponse.json({ message: "title and slug are required" }, { status: 400 });
  }

  const products = await readProductsJson();
  const slugTaken = products.some((p) => p.slug === dto.slug);
  if (slugTaken) {
    return NextResponse.json({ message: "Slug already exists" }, { status: 409 });
  }

  const id = randomUUID();
  const product = toProductFromUpsertDto(id, dto);

  await writeProductsJson([product, ...products]);
  return NextResponse.json(product, { status: 201 });
}
