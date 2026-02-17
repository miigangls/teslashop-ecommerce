import { atom } from "jotai";
import {
  authBootstrappedAtom,
  authRoleAtom,
  authStatusAtom,
  authUserAtom,
} from "./auth.atoms";
import { AuthResponse } from "../infrastructure/auth.types";

type AuthAction =
  | { type: "setAuthenticated"; payload: AuthResponse }
  | { type: "setNotAuthenticated" }
  | { type: "setChecking" };

export const authActionsAtom = atom(null, async (_get, set, action: AuthAction) => {
  if (action.type === "setChecking") {
    set(authStatusAtom, "checking");
    return;
  }

  if (action.type === "setNotAuthenticated") {
    set(authStatusAtom, "not-authenticated");
    set(authUserAtom, null);
    set(authRoleAtom, null);
    set(authBootstrappedAtom, true);
    return;
  }

  if (action.type === "setAuthenticated") {
    set(authStatusAtom, "authenticated");
    set(authUserAtom, action.payload.user);
    set(authRoleAtom, action.payload.user.roles.includes("admin") ? "admin" : "user");
    set(authBootstrappedAtom, true);
  }
});
