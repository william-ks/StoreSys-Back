import { z } from "zod";

export const categoryCreateSchema = z.object({
  description: z.string().min(3),
});
