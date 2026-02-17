export type ProductSize = "XS" | "S" | "M" | "L" | "XL" | "XXL";
export type ProductGender = "kid" | "men" | "women" | "unisex";
export type PriceFilter = "any" | "0-50" | "50-100" | "100-200" | "200+";
export type ViewMode = "grid" | "list";

export interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  slug: string;
  stock: number;
  sizes: ProductSize[];
  gender: ProductGender;
  tags: string[];
  images: string[];
}

export interface ProductsResponse {
  count: number;
  pages: number;
  products: Product[];
}
