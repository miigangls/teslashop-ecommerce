"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import type { Product, ProductGender, ProductSize } from "../../infrastructure/product.types";
import type { ProductUpsertDto } from "../../server/dto/product.dto";
import { slugify } from "../../utils/slugify";

export interface ProductFormValues {
  title: string;
  slug: string;
  price: number;
  description: string;
  stock: number;
  gender: ProductGender;
  sizes: ProductSize[];
  tags: string;
  images: string[];
}

const EMPTY_PRODUCT: ProductFormValues = {
  title: "",
  slug: "",
  price: 0,
  description: "",
  stock: 0,
  gender: "unisex",
  sizes: [],
  tags: "",
  images: [],
};

export function toUpsertDto(values: ProductFormValues): ProductUpsertDto {
  return {
    title: values.title,
    slug: values.slug,
    price: Number(values.price),
    description: values.description,
    stock: Number(values.stock),
    gender: values.gender,
    sizes: values.sizes,
    tags: values.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    images: values.images,
  };
}

export function toFormValues(product: Product): ProductFormValues {
  return {
    title: product.title,
    slug: product.slug,
    price: product.price,
    description: product.description,
    stock: product.stock,
    gender: product.gender,
    sizes: product.sizes,
    tags: product.tags.join(", "),
    images: product.images,
  };
}

export function useProductForm(options: { mode: "new" | "edit"; initial?: Product | null }) {
  const [autoSlug, setAutoSlug] = useState(true);
  const initialValues = useMemo(() => {
    if (options.mode === "edit" && options.initial) return toFormValues(options.initial);
    return EMPTY_PRODUCT;
  }, [options.initial, options.mode]);

  const form = useForm<ProductFormValues>({
    defaultValues: {
      ...initialValues,
    },
  });

  useEffect(() => {
    form.reset(initialValues);
    setAutoSlug(options.mode === "new");
  }, [form, initialValues, options.mode]);

  useEffect(() => {
    if (!autoSlug) return;
    const sub = form.watch((values, { name }) => {
      if (name !== "title") return;
      const title = values.title ?? "";
      form.setValue("slug", slugify(title), { shouldDirty: true });
    });
    return () => sub.unsubscribe();
  }, [autoSlug, form]);

  return { form, autoSlug, setAutoSlug };
}
