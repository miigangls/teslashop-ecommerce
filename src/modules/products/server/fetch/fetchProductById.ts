import { API_ENDPOINTS, NEXT_API_URL } from "@/modules/common/constants";
import { GenericRepository } from "@/modules/fetch/fetch.generic";
import type { Product } from "../../infrastructure/product.types";
import { toProductImageUrl } from "../../utils/imageMap";

const repo = new GenericRepository({ API_URL: NEXT_API_URL });

export async function fetchProductById(idOrSlug: string): Promise<Product> {
  const product = await repo.GET<unknown, Product>({
    path: `${API_ENDPOINTS.products}/${encodeURIComponent(idOrSlug)}`,
  });

  return {
    ...product,
    images: product.images.map(toProductImageUrl),
  };
}
