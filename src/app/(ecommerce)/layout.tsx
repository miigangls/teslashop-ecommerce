import { ReactNode } from "react";
import { ShopFooter } from "@/modules/common/sections/components/ShopFooter";
import { ShopHeader } from "@/modules/common/sections/components/ShopHeader";

interface Props {
  children: ReactNode;
}

export default function EcommerceLayout({ children }: Props) {
  return (
    <div className="flex min-h-screen flex-col">
      <ShopHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">{children}</main>
      <ShopFooter />
    </div>
  );
}
