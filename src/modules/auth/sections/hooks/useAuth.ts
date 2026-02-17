"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { useCallback } from "react";
import { authActionsAtom } from "../../state/auth.actions.atom";
import { authRoleAtom, authStatusAtom, authUserAtom } from "../../state/auth.atoms";
import {
  authApiCheckStatus,
  authApiLogin,
  authApiLogout,
} from "../services/auth.api";
import { LoginRequest } from "../../infrastructure/auth.types";

export function useAuth() {
  const status = useAtomValue(authStatusAtom);
  const user = useAtomValue(authUserAtom);
  const role = useAtomValue(authRoleAtom);
  const dispatch = useSetAtom(authActionsAtom);

  const bootstrap = useCallback(async () => {
    dispatch({ type: "setChecking" });
    try {
      const data = await authApiCheckStatus();
      dispatch({ type: "setAuthenticated", payload: data });
    } catch {
      dispatch({ type: "setNotAuthenticated" });
    }
  }, [dispatch]);

  const login = useCallback(
    async (payload: LoginRequest) => {
      dispatch({ type: "setChecking" });
      const data = await authApiLogin(payload);
      dispatch({ type: "setAuthenticated", payload: data });
      return data;
    },
    [dispatch],
  );

  const logout = useCallback(async () => {
    await authApiLogout();
    dispatch({ type: "setNotAuthenticated" });
  }, [dispatch]);

  return { status, user, role, bootstrap, login, logout };
}
