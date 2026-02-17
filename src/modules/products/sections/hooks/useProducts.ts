"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { filtersAtom } from "../../state/filters.selectors";
import { parsePriceFilter } from "../../utils/priceRange";
import { fetchProducts } from "../../server/fetch/fetchProducts";

interface Options {
  gender?: string;
}

const DEFAULT_PAGE_SIZE = 9;

export function useProducts(options: Options = {}) {
  const filters = useAtomValue(filtersAtom);
  const { minPrice, maxPrice } = parsePriceFilter(filters.price);

  const sizes =
    filters.sizes.length > 0
      ? filters.sizes.map((size) => size.toLowerCase()).join(",")
      : undefined;

  const offset = (filters.page - 1) * DEFAULT_PAGE_SIZE;

  return useQuery({
    queryKey: [
      "products",
      {
        ...filters,
        gender: options.gender,
      },
    ],
    queryFn: () =>
      fetchProducts({
        limit: DEFAULT_PAGE_SIZE,
        offset,
        gender: options.gender,
        sizes,
        minPrice,
        maxPrice,
        query: filters.query.trim() ? filters.query.trim() : undefined,
        price: filters.price !== "any" ? filters.price : undefined,
      }),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });
}
