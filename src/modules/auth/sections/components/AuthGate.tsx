"use client";

import { ReactNode } from "react";
import { useAtomValue } from "jotai";
import { authBootstrappedAtom, authStatusAtom } from "../../state/auth.atoms";
import { useAuthBootstrap } from "../hooks/useAuthBootstrap";
import { FullScreenLoading } from "@/modules/common/sections/components/FullScreenLoading";

interface Props {
  children: ReactNode;
}

export function AuthGate({ children }: Props) {
  useAuthBootstrap();
  const status = useAtomValue(authStatusAtom);
  const bootstrapped = useAtomValue(authBootstrappedAtom);

  if (!bootstrapped && status === "checking") {
    return <FullScreenLoading />;
  }

  return children;
}
