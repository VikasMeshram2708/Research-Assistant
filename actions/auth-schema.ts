import * as z from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(1, "Name is required").max(255, "Name is too long"),
    email: z.email("Please enter a valid email"),
    password: z
      .string()
      .min(1, "Password must be at least 8 characters")
      .max(1000, "Password is too long"),
    confirmPassword: z
      .string()
      .min(1, "Confirm password is required")
      .max(1000, "Confirm password is too long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type registerSchema = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.email("Please enter a valid email"),
  password: z
    .string()
    .min(1, "Password must be at least 8 characters")
    .max(1000, "Password is too long"),
});

type loginSchema = z.infer<typeof loginSchema>;
