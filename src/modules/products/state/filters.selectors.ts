import { atom } from "jotai";
import {
  pageAtom,
  priceAtom,
  queryAtom,
  sizesAtom,
  viewModeAtom,
} from "./filters.atoms";

export const filtersAtom = atom((get) => ({
  query: get(queryAtom),
  page: get(pageAtom),
  sizes: get(sizesAtom),
  price: get(priceAtom),
  viewMode: get(viewModeAtom),
}));
