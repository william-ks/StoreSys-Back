import { z } from "zod";

export const ProductCreateSchema = z.object({
  name: z.string().min(3),
  value: z.number().min(0),
  stock: z.number().min(0),
  url: z.string().url().nullable(),
  path: z.string(),
  category_id: z.number().min(0),
});

export const ProductUpdateSchema = z.object({
  name: z.string().min(3).nullable(),
  value: z.number().min(0).nullable(),
  stock: z.number().min(0).nullable(),
  url: z.string().url().nullable(),
  path: z.string().nullable(),
  category_id: z.number().min(0).nullable(),
});
