const { z } = require("zod");

const registerSchema = z.object({
  body: z.object({
    firstName: z
      .string()
      .trim()
      .min(2, "First name must contain at least 2 characters")
      .max(50, "First name cannot exceed 50 characters"),

    lastName: z
      .string()
      .trim()
      .min(2, "Last name must contain at least 2 characters")
      .max(50, "Last name cannot exceed 50 characters"),

    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Please provide a valid email address"),

    phone: z
      .string()
      .trim()
      .regex(
        /^(?:\+977)?9[6-8]\d{8}$/,
        "Please provide a valid Nepal phone number"
      ),

    password: z
      .string()
      .min(8, "Password must contain at least 8 characters")
      .max(128, "Password cannot exceed 128 characters"),

    role: z
      .enum(["CUSTOMER", "PROVIDER"])
      .default("CUSTOMER"),
  }),

  params: z.object({}),

  query: z.object({}),
});

module.exports = {
  registerSchema,
};