import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads", "products");

export async function ensureUploadsDir() {
  await mkdir(UPLOADS_DIR, { recursive: true });
  return UPLOADS_DIR;
}

export async function saveProductUpload(filename: string, buffer: Buffer) {
  const dir = await ensureUploadsDir();
  const fullPath = path.join(dir, filename);
  await writeFile(fullPath, buffer);
  return fullPath;
}

