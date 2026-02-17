import { atom } from "jotai";
import { PriceFilter, ProductSize, ViewMode } from "../infrastructure/product.types";

export const queryAtom = atom("");
export const pageAtom = atom(1);
export const sizesAtom = atom<ProductSize[]>([]);
export const priceAtom = atom<PriceFilter>("any");
export const viewModeAtom = atom<ViewMode>("grid");
