import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z
    .enum(["admin", "sales"], {
      errorMap: () => ({ message: "Invalid role" }),
    })
    .optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const leadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  status: z.enum(["New", "Contacted", "Qualified", "Lost"], {
    errorMap: () => ({ message: "Invalid status value" }),
  }),
  source: z.enum(["Website", "Instagram", "Referral"], {
    errorMap: () => ({ message: "Invalid source value" }),
  }),
});