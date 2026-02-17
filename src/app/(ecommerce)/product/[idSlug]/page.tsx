import { ProductDetail } from "@/modules/products/sections/components/ProductDetail";

interface Props {
  params: Promise<{ idSlug: string }>;
}

export default async function ProductPage({ params }: Props) {
  const { idSlug } = await params;

  return <ProductDetail idOrSlug={idSlug} />;
}
