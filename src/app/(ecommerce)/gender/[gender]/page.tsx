import { notFound } from "next/navigation";
import { ProductsCatalog } from "@/modules/products/sections/components/ProductsCatalog";

interface Props {
  params: Promise<{ gender: string }>;
}

export default async function GenderPage({ params }: Props) {
  const { gender } = await params;

  const allowed = new Set(["men", "women", "kid", "unisex"]);
  if (!allowed.has(gender)) notFound();

  const titleMap: Record<string, string> = {
    men: "Hombres",
    women: "Mujeres",
    kid: "Niños",
    unisex: "Unisex",
  };

  return <ProductsCatalog gender={gender} title={titleMap[gender] ?? "Productos"} />;
}
