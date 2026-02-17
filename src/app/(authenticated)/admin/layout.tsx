import { ReactNode } from "react";
import Link from "next/link";

interface Props {
  children: ReactNode;
}

export default function AdminLayout({ children }: Props) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-6">
      <header className="mb-6 flex items-center justify-between border-b pb-3">
        <h1 className="text-xl font-semibold">Admin</h1>
        <nav className="flex items-center gap-3 text-sm">
          <Link href="/admin">Dashboard</Link>
          <Link href="/admin/products">Productos</Link>
          <Link href="/">Shop</Link>
        </nav>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
