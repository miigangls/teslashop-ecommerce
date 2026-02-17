import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Product } from "../../infrastructure/product.types";

const PRODUCTS_FILE = path.join(process.cwd(), "public", "data", "products.json");

export async function readProductsJson(): Promise<Product[]> {
  const raw = await readFile(PRODUCTS_FILE, "utf-8").catch(() => "[]");
  const data = JSON.parse(raw) as unknown;
  return Array.isArray(data) ? (data as Product[]) : [];
}

export async function writeProductsJson(products: Product[]): Promise<void> {
  const json = JSON.stringify(products, null, 2);
  await writeFile(PRODUCTS_FILE, json, "utf-8");
}

