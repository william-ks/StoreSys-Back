import { z } from "zod";

export const machineCreateSchema = z.object({
  title: z.string().min(3),
  credit: z.number().min(0),
  debit: z.number().min(0),
});

export const machineUpdateSchema = z.object({
  title: z.string().min(3).nullable(),
  credit: z.number().min(0).nullable(),
  debit: z.number().min(0).nullable(),
});
