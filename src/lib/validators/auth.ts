import { z } from "zod";

export const RegisterSchema = z.object({
  email: z.email("Please enter a valid email address").trim().toLowerCase(),

  password: z.string().min(12, "Password must be at least 12 characters"),

  name: z.string().min(2, "Name is too short").or(z.literal("")).optional(),
});
