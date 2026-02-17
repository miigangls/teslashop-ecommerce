import { atom } from "jotai";
import { AuthStatus, User } from "../infrastructure/auth.types";

export const authStatusAtom = atom<AuthStatus>("checking");
export const authUserAtom = atom<User | null>(null);
export const authRoleAtom = atom<string | null>(null);
export const authBootstrappedAtom = atom(false);
