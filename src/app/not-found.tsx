import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center gap-3 px-4 text-center">
      <h1 className="text-3xl font-semibold">Pagina no encontrada</h1>
      <p className="text-muted-foreground">
        La ruta solicitada no existe en esta version.
      </p>
      <Link href="/" className="text-sm hover:underline">
        Volver al inicio
      </Link>
    </main>
  );
}
