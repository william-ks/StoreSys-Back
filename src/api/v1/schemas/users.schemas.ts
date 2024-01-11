import { z } from "zod";

export const UserLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(5),
});

export const UserCreateSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(3),
  hierarchy_id: z.number().min(1).max(4)
});

export const UserUpdateSelfSchema = z.object({
  name: z.string().min(3).nullable(),
  email: z.string().email(),
  newPassword: z.string().min(3),
  actualPassword: z.string().min(3),
});
