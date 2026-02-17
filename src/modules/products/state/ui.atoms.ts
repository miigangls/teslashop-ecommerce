import { atom } from "jotai";
import { ViewMode } from "../infrastructure/product.types";

export const productsSidebarOpenAtom = atom(false);
export const adminSelectionAtom = atom<string[]>([]);
export const productsViewModeAtom = atom<ViewMode>("grid");
