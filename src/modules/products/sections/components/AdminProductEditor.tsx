"use client";

import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Product, ProductGender, ProductSize } from "../../infrastructure/product.types";
import { createProduct, updateProduct } from "../../server/actions/createUpdateProduct";
import { uploadProductImage } from "../../server/actions/uploadProductImage";
import { sleep } from "@/lib/sleep";
import { type ProductFormValues, useProductForm, toUpsertDto } from "../hooks/useProductForm";

const ALL_SIZES: ProductSize[] = ["XS", "S", "M", "L", "XL", "XXL"];
const ALL_GENDERS: ProductGender[] = ["kid", "men", "women", "unisex"];

interface Props {
  id: string;
  initial?: Product | null;
}

export function AdminProductEditor({ id, initial }: Props) {
  const router = useRouter();
  const qc = useQueryClient();
  const isNew = id === "new";

  const { form } = useProductForm({
    mode: isNew ? "new" : "edit",
    initial: initial ?? null,
  });

  const [uploading, setUploading] = useState(false);

  const upsertMutation = useMutation({
    mutationFn: async (values: ProductFormValues) => {
      const dto = toUpsertDto(values);
      await sleep(1500);
      if (isNew) return createProduct(dto);
      return updateProduct(id, dto);
    },
    onSuccess: async (product) => {
      toast.success("Producto guardado");
      await qc.invalidateQueries({ queryKey: ["products"] });
      await qc.invalidateQueries({ queryKey: ["admin-products"] });
      await qc.invalidateQueries({ queryKey: ["product", product.id] });
      router.replace(`/admin/products/${product.id}`);
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "No se pudo guardar");
    },
  });

  const images = form.watch("images");

  const canSave = useMemo(() => !upsertMutation.isPending && !uploading, [upsertMutation.isPending, uploading]);

  const onUpload = async (file: File) => {
    setUploading(true);
    try {
      const { fileName } = await uploadProductImage(file);
      form.setValue("images", [...(images ?? []), fileName], { shouldDirty: true });
      toast.success("Imagen subida");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al subir imagen");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form
      className="space-y-6"
      onSubmit={form.handleSubmit((values) => upsertMutation.mutate(values))}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            {isNew ? "Nuevo producto" : "Editar producto"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {isNew ? "Crea un nuevo producto" : `ID: ${id}`}
          </p>
        </div>
        <button
          type="submit"
          disabled={!canSave}
          className="h-9 rounded-md border px-3 text-sm hover:bg-muted disabled:opacity-50"
        >
          {upsertMutation.isPending ? "Guardando..." : "Guardar"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-lg border bg-background p-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Título</label>
            <input
              {...form.register("title", { required: true })}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Slug</label>
            <input
              {...form.register("slug", { required: true })}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Precio</label>
              <input
                type="number"
                step="0.01"
                {...form.register("price", { valueAsNumber: true, min: 0 })}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Stock</label>
              <input
                type="number"
                {...form.register("stock", { valueAsNumber: true, min: 0 })}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Género</label>
            <select
              {...form.register("gender")}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {ALL_GENDERS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tallas</label>
            <div className="flex flex-wrap gap-2">
              {ALL_SIZES.map((size) => {
                const checked = (form.getValues("sizes") ?? []).includes(size);
                return (
                  <label key={size} className="inline-flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {
                        const current = form.getValues("sizes") ?? [];
                        const next = checked
                          ? current.filter((s) => s !== size)
                          : [...current, size];
                        form.setValue("sizes", next, { shouldDirty: true });
                      }}
                    />
                    {size}
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-4 rounded-lg border bg-background p-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Descripción</label>
            <textarea
              rows={6}
              {...form.register("description")}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tags (CSV)</label>
            <input
              {...form.register("tags")}
              placeholder="tesla, hoodie, premium"
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Imágenes</label>
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept="image/*"
                aria-label="Subir imagen de producto"
                onChange={(e) => {
                  const file = e.target.files?.item(0);
                  if (file) void onUpload(file);
                }}
              />
              {uploading ? <span className="text-sm text-muted-foreground">Subiendo...</span> : null}
            </div>

            <div className="space-y-2">
              {(images ?? []).map((img) => (
                <div key={img} className="flex items-center justify-between gap-2 rounded-md border p-2">
                  <div className="truncate text-sm">{img}</div>
                  <button
                    type="button"
                    className="text-sm hover:underline"
                    onClick={() => {
                      const next = (form.getValues("images") ?? []).filter((i) => i !== img);
                      form.setValue("images", next, { shouldDirty: true });
                    }}
                  >
                    Quitar
                  </button>
                </div>
              ))}
              {(images ?? []).length === 0 ? (
                <div className="text-sm text-muted-foreground">Sin imágenes aún.</div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {upsertMutation.isError ? (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm">
          {upsertMutation.error instanceof Error
            ? upsertMutation.error.message
            : "No se pudo guardar"}
        </div>
      ) : null}
    </form>
  );
}

