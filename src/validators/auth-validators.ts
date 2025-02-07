import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(3, "Name must be at least 3 characters long"),
  password: z
    .string()
    .min(8, "Password must be at least 6 characters long")
    .max(60),
  avatar: z.string().url().optional(), // Avatar is optional
});
export type registerType = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 6 characters long")
    .max(60),
});
export type loginType = z.infer<typeof loginSchema>;

export const passwordResetSchema = z.object({
  email: z.string().email("Invalid email address"),
});
export type passwordResetType = z.infer<typeof passwordResetSchema>;

export const verifyOtpSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().length(6, "OTP must be 6 digits"), // Adjust length based on your OTP generation
});
export type verifyOtpType = z.infer<typeof verifyOtpSchema>;
