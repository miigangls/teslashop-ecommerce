"use client";

import { useAtom } from "jotai";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { pageAtom, priceAtom, queryAtom, sizesAtom, viewModeAtom } from "./filters.atoms";
import {
  parseFiltersFromSearchParams,
  serializeFiltersToSearchParams,
} from "../utils/filters.serialization";

function getNonPageKey(filters: {
  query: string;
  sizes: string[];
  price: string;
  viewMode: string;
}) {
  const sizesKey = [...filters.sizes].sort().join(",");
  return `${filters.query}__${sizesKey}__${filters.price}__${filters.viewMode}`;
}

export function useFiltersSync() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = useAtom(queryAtom);
  const [page, setPage] = useAtom(pageAtom);
  const [sizes, setSizes] = useAtom(sizesAtom);
  const [price, setPrice] = useAtom(priceAtom);
  const [viewMode, setViewMode] = useAtom(viewModeAtom);

  const [synced, setSynced] = useState(false);

  const lastNonPageKeyRef = useRef<string | null>(null);

  const filters = useMemo(
    () => ({ query, page, sizes, price, viewMode }),
    [page, price, query, sizes, viewMode],
  );

  // URL -> atoms (source of truth)
  useEffect(() => {
    const parsed = parseFiltersFromSearchParams(searchParams);

    if (parsed.query !== query) setQuery(parsed.query);
    if (parsed.page !== page) setPage(parsed.page);
    if (parsed.price !== price) setPrice(parsed.price);
    if (parsed.viewMode !== viewMode) setViewMode(parsed.viewMode);

    const sizesKey = parsed.sizes.join(",");
    const currentSizesKey = sizes.join(",");
    if (sizesKey !== currentSizesKey) setSizes(parsed.sizes);

    lastNonPageKeyRef.current = getNonPageKey(parsed);
    setSynced(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // atoms -> URL (keep URL in sync with UI changes)
  useEffect(() => {
    if (!synced) return;

    const nextNonPageKey = getNonPageKey(filters);
    const prevNonPageKey = lastNonPageKeyRef.current;

    if (prevNonPageKey && nextNonPageKey !== prevNonPageKey && filters.page !== 1) {
      setPage(1);
      return;
    }

    const nextParams = serializeFiltersToSearchParams(filters, searchParams);
    const nextUrl = nextParams.toString() ? `${pathname}?${nextParams.toString()}` : pathname;
    const currentUrl = searchParams.toString()
      ? `${pathname}?${searchParams.toString()}`
      : pathname;

    if (nextUrl !== currentUrl) router.replace(nextUrl);
    lastNonPageKeyRef.current = nextNonPageKey;
  }, [filters, pathname, router, searchParams, setPage, synced]);

  return { synced };
}
