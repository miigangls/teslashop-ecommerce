"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAuth } from "@/modules/auth/sections/hooks/useAuth";
import { LoginRequest } from "@/modules/auth/infrastructure/auth.types";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  const { login } = useAuth();
  const form = useForm<LoginRequest>({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await login(values);
      toast.success("Bienvenido");
      router.replace(callbackUrl);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Login failed");
    }
  });

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Iniciar sesion</h1>
        <p className="text-sm text-muted-foreground">
          Mock users: <span className="font-medium">admin@tesla.shop</span> /{" "}
          <span className="font-medium">admin123</span>
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-3">
        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            {...form.register("email", { required: true })}
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            {...form.register("password", { required: true })}
          />
        </div>
        <button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="h-9 w-full rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground disabled:opacity-70"
        >
          {form.formState.isSubmitting ? "Ingresando..." : "Login"}
        </button>
      </form>

      <Link href="/auth/register" className="text-sm hover:underline">
        Ir a registro
      </Link>
    </div>
  );
}
