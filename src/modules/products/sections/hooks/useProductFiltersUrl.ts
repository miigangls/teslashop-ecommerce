"use client";

import { useFiltersSync } from "../../state/filters.sync";

export function useProductFiltersUrl() {
  return useFiltersSync();
}
