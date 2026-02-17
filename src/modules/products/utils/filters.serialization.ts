import { PriceFilter, ProductSize, ViewMode } from "../infrastructure/product.types";

export interface ProductFiltersQuery {
  query: string;
  page: number;
  sizes: ProductSize[];
  price: PriceFilter;
  viewMode: ViewMode;
}

export const defaultFilters: ProductFiltersQuery = {
  query: "",
  page: 1,
  sizes: [],
  price: "any",
  viewMode: "grid",
};

const VALID_PRICES: PriceFilter[] = ["any", "0-50", "50-100", "100-200", "200+"];
const VALID_VIEW_MODES: ViewMode[] = ["grid", "list"];
const VALID_SIZES: ProductSize[] = ["XS", "S", "M", "L", "XL", "XXL"];

type SearchParamsLike = Pick<URLSearchParams, "get" | "toString">;

function parsePositiveInt(value: string | null) {
  if (!value) return 1;
  const parsed = Number(value);
  if (Number.isNaN(parsed) || parsed < 1) return 1;
  return Math.floor(parsed);
}

function parseSizes(value: string | null) {
  if (!value) return [];
  const rawSizes = value.split(",").map((size) => size.trim()).filter(Boolean);
  const normalized = rawSizes.map((size) => size.toUpperCase());
  return normalized.filter((size): size is ProductSize =>
    VALID_SIZES.includes(size as ProductSize),
  );
}

export function parseFiltersFromSearchParams(
  searchParams: SearchParamsLike,
): ProductFiltersQuery {
  const query = searchParams.get("query")?.trim() ?? "";
  const page = parsePositiveInt(searchParams.get("page"));
  const sizes = parseSizes(searchParams.get("sizes"));
  const priceRaw = searchParams.get("price");
  const viewModeRaw = searchParams.get("viewMode");

  return {
    query,
    page,
    sizes,
    price: VALID_PRICES.includes(priceRaw as PriceFilter)
      ? (priceRaw as PriceFilter)
      : "any",
    viewMode: VALID_VIEW_MODES.includes(viewModeRaw as ViewMode)
      ? (viewModeRaw as ViewMode)
      : "grid",
  };
}

export function serializeFiltersToSearchParams(
  filters: ProductFiltersQuery,
  baseSearchParams?: SearchParamsLike,
) {
  const params = new URLSearchParams(baseSearchParams?.toString() ?? "");
  const query = filters.query.trim();

  if (query) params.set("query", query);
  else params.delete("query");

  if (filters.page > 1) params.set("page", String(filters.page));
  else params.delete("page");

  if (filters.sizes.length > 0)
    params.set("sizes", filters.sizes.map((size) => size.toLowerCase()).join(","));
  else params.delete("sizes");

  if (filters.price !== "any") params.set("price", filters.price);
  else params.delete("price");

  if (filters.viewMode !== "grid") params.set("viewMode", filters.viewMode);
  else params.delete("viewMode");

  return params;
}
