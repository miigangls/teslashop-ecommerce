"use client";

import { useQuery } from "@tanstack/react-query";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import { authActionsAtom } from "../../state/auth.actions.atom";
import { authBootstrappedAtom } from "../../state/auth.atoms";
import { authApiCheckStatus } from "../services/auth.api";

export function useAuthBootstrap() {
  const dispatch = useSetAtom(authActionsAtom);
  const bootstrapped = useAtomValue(authBootstrappedAtom);

  const query = useQuery({
    queryKey: ["auth"],
    queryFn: authApiCheckStatus,
    retry: false,
    refetchInterval: 90_000,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (!bootstrapped) dispatch({ type: "setChecking" });
  }, [bootstrapped, dispatch]);

  useEffect(() => {
    if (query.isPending) return;

    if (query.isSuccess) {
      dispatch({ type: "setAuthenticated", payload: query.data });
      return;
    }

    if (query.isError) {
      dispatch({ type: "setNotAuthenticated" });
    }
  }, [dispatch, query.data, query.isError, query.isPending, query.isSuccess]);

  return query;
}
