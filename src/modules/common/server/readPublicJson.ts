import { readFile } from "node:fs/promises";
import path from "node:path";

export async function readPublicJson<T>(relativePath: string): Promise<T> {
  const absolute = path.join(process.cwd(), "public", relativePath);
  const raw = await readFile(absolute, "utf-8");
  return JSON.parse(raw) as T;
}
