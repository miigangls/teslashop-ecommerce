"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchProducts } from "../../server/fetch/fetchProducts";

interface Options {
  page: number;
  query?: string;
}

const PAGE_SIZE = 12;

export function useAdminProducts({ page, query }: Options) {
  const safePage = Number.isFinite(page) && page >= 1 ? Math.floor(page) : 1;
  const offset = (safePage - 1) * PAGE_SIZE;

  return useQuery({
    queryKey: ["admin-products", { page: safePage, query }],
    queryFn: () =>
      fetchProducts({
        limit: PAGE_SIZE,
        offset,
        query: query?.trim() ? query.trim() : undefined,
      }),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 1,
  });
}

