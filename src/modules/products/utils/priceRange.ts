import { PriceFilter } from "../infrastructure/product.types";

export function parsePriceFilter(value: PriceFilter): {
  minPrice?: number;
  maxPrice?: number;
} {
  if (value === "any") return {};
  if (value === "200+") return { minPrice: 200 };

  const [min, max] = value.split("-").map((item) => Number(item));
  return { minPrice: min, maxPrice: max };
}
