const { z } = require("zod");

const getMeSchema = z.object({
  body: z.any().optional(),
  params: z.object({}),
  query: z.object({}),
});

const updateProfileSchema = z.object({
  body: z
    .object({
      firstName: z
        .string()
        .trim()
        .min(2, "First name must be at least 2 characters")
        .max(50, "First name cannot exceed 50 characters")
        .optional(),

      lastName: z
        .string()
        .trim()
        .min(2, "Last name must be at least 2 characters")
        .max(50, "Last name cannot exceed 50 characters")
        .optional(),

      phone: z
        .string()
        .trim()
        .regex(
          /^(?:\+977)?9[6-8]\d{8}$/,
          "Please provide a valid Nepal phone number"
        )
        .optional(),
    })
    .refine(
      (data) => Object.keys(data).length > 0,
      {
        message: "At least one field is required",
      }
    ),

  params: z.object({}),
  query: z.object({}),
});

const changePasswordSchema = z.object({
  body: z
    .object({
      currentPassword: z
        .string()
        .min(1, "Current password is required"),

      newPassword: z
        .string()
        .min(8, "New password must be at least 8 characters")
        .max(128, "New password cannot exceed 128 characters"),

      confirmPassword: z
        .string()
        .min(1, "Confirm password is required"),
    })
    .refine(
      (data) => data.newPassword === data.confirmPassword,
      {
        message: "Passwords do not match",
        path: ["confirmPassword"],
      }
    )
    .refine(
      (data) => data.currentPassword !== data.newPassword,
      {
        message:
          "New password must be different from current password",
        path: ["newPassword"],
      }
    ),

  params: z.object({}),
  query: z.object({}),
});

module.exports = {
  getMeSchema,
  updateProfileSchema,
  changePasswordSchema,
};