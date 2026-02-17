"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchProductById } from "../../server/fetch/fetchProductById";

export function useProduct(idOrSlug: string) {
  return useQuery({
    queryKey: ["product", idOrSlug],
    queryFn: () => fetchProductById(idOrSlug),
    enabled: Boolean(idOrSlug),
    staleTime: 1000 * 60 * 5,
  });
}
