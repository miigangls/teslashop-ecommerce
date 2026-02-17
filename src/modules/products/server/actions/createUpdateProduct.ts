import { API_ENDPOINTS, NEXT_API_URL } from "@/modules/common/constants";
import { GenericRepository } from "@/modules/fetch/fetch.generic";
import type { Product } from "../../infrastructure/product.types";
import type { ProductUpsertDto } from "../dto/product.dto";

const repo = new GenericRepository({ API_URL: NEXT_API_URL });

export async function createProduct(payload: ProductUpsertDto): Promise<Product> {
  return repo.POST<ProductUpsertDto, Product>({
    path: API_ENDPOINTS.products,
    data: payload,
  });
}

export async function updateProduct(id: string, payload: ProductUpsertDto): Promise<Product> {
  return repo.PATCH<ProductUpsertDto, Product>({
    path: `${API_ENDPOINTS.products}/${encodeURIComponent(id)}`,
    data: payload,
  });
}
