import { notFound } from "next/navigation";
import { AdminProductEditor } from "@/modules/products/sections/components/AdminProductEditor";
import { readProductsJson } from "@/modules/products/server/persistence/productsJson";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminProductEditorPage({ params }: Props) {
  const { id } = await params;

  if (id === "new") return <AdminProductEditor id="new" />;

  const products = await readProductsJson();
  const product = products.find((p) => p.id === id);
  if (!product) notFound();

  return <AdminProductEditor id={id} initial={product} />;
}
