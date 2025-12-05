import { z } from "zod";

// Schema for login credentials
export const signInSchema = z.object({
  identifier: z
    .string()
    .min(1, "Email or phone is required")
    .refine(
      (val) => {
        // Check if it's an email or phone (11 digits)
        const isEmail = val.includes("@");
        const isPhone = /^\d{11}$/.test(val);
        return isEmail || isPhone;
      },
      {
        message: "Must be a valid email address or 11-digit phone number",
      }
    ),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

// Schema for registration
export const registerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z.string().regex(/^\d{11}$/, "Phone number must be exactly 11 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  email: z.string().email("Invalid email address").optional(),
});

export type SignInInput = z.infer<typeof signInSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
