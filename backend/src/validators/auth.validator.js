const { z } = require("zod");

const registerSchema = z.object({
  body: z.object({
    firstName: z
      .string()
      .trim()
      .min(2, "First name must be at least 2 characters")
      .max(50, "First name cannot exceed 50 characters"),

    lastName: z
      .string()
      .trim()
      .min(2, "Last name must be at least 2 characters")
      .max(50, "Last name cannot exceed 50 characters"),

    email: z
      .string()
      .trim()
      .email("Please provide a valid email address")
      .transform((value) => value.toLowerCase()),

    phone: z
      .string()
      .trim()
      .regex(
        /^(?:\+977)?9[6-8]\d{8}$/,
        "Please provide a valid Nepal phone number",
      ),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password cannot exceed 128 characters"),

    role: z.enum(["CUSTOMER", "PROVIDER"]).default("CUSTOMER"),
  }),

  params: z.object({}),

  query: z.object({}),
});

const loginSchema = z.object({
  body: z.object({
    email: z
      .string()
      .trim()
      .email("Please provide a valid email address")
      .transform((value) => value.toLowerCase()),

    password: z
      .string()
      .min(1, "Password is required")
      .max(128, "Password cannot exceed 128 characters"),
  }),

  params: z.object({}),

  query: z.object({}),
});

const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, "Refresh token is required"),
  }),

  params: z.object({}),

  query: z.object({}),
});

module.exports = {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
};
