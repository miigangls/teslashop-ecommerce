import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Registro</h1>
      <p className="text-sm text-muted-foreground">
        Pantalla visual, alineada con el estado actual del proyecto base.
      </p>
      <Link href="/auth/login" className="text-sm hover:underline">
        Volver al login
      </Link>
    </div>
  );
}
