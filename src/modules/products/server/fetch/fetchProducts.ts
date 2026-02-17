import { API_ENDPOINTS, NEXT_API_URL } from "@/modules/common/constants";
import { GenericRepository } from "@/modules/fetch/fetch.generic";
import type { ProductsResponse } from "../../infrastructure/product.types";
import { toProductImageUrl } from "../../utils/imageMap";

interface Options {
  limit: number;
  offset: number;
  gender?: string;
  sizes?: string;
  minPrice?: number;
  maxPrice?: number;
  query?: string;
  price?: string;
}

const repo = new GenericRepository({ API_URL: NEXT_API_URL });

export async function fetchProducts(options: Options): Promise<ProductsResponse> {
  const params = new URLSearchParams();
  params.set("limit", String(options.limit));
  params.set("offset", String(options.offset));

  if (options.gender) params.set("gender", options.gender);
  if (options.sizes) params.set("sizes", options.sizes);
  if (typeof options.minPrice === "number") params.set("minPrice", String(options.minPrice));
  if (typeof options.maxPrice === "number") params.set("maxPrice", String(options.maxPrice));
  if (options.query) params.set("q", options.query);
  if (options.price) params.set("price", options.price);

  const data = await repo.GET<unknown, ProductsResponse>({
    path: `${API_ENDPOINTS.products}?${params.toString()}`,
  });

  return {
    ...data,
    products: data.products.map((product) => ({
      ...product,
      images: product.images.map(toProductImageUrl),
    })),
  };
}
