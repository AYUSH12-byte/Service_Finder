const { z } = require("zod");

const priceTypes = ["FIXED", "HOURLY", "STARTING_FROM", "CUSTOM_QUOTE"];

const createServiceSchema = z.object({
  body: z.object({
    category: z.string().min(1, "Category is required"),

    name: z
      .string()
      .trim()
      .min(2, "Service name must be at least 2 characters")
      .max(150, "Service name cannot exceed 150 characters"),

    slug: z
      .string()
      .trim()
      .min(2)
      .max(150)
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Slug must contain only lowercase letters, numbers, and hyphens",
      ),

    description: z.string().trim().max(1000).optional(),

    icon: z.string().trim().max(100).optional(),

    image: z.string().trim().url().optional(),

    basePrice: z.number().min(0).optional(),

    priceType: z.enum(priceTypes).optional(),

    estimatedDurationMinutes: z.number().int().min(15).optional(),

    isActive: z.boolean().optional(),

    sortOrder: z.number().int().min(0).optional(),
  }),

  params: z.object({}),
  query: z.object({}),
});

const updateServiceSchema = z.object({
  body: z
    .object({
      category: z.string().min(1).optional(),

      name: z.string().trim().min(2).max(150).optional(),

      slug: z
        .string()
        .trim()
        .min(2)
        .max(150)
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
        .optional(),

      description: z.string().trim().max(1000).nullable().optional(),

      icon: z.string().trim().max(100).nullable().optional(),

      image: z.string().trim().url().nullable().optional(),

      basePrice: z.number().min(0).optional(),

      priceType: z.enum(priceTypes).optional(),

      estimatedDurationMinutes: z.number().int().min(15).nullable().optional(),

      isActive: z.boolean().optional(),

      sortOrder: z.number().int().min(0).optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field is required",
    }),

  params: z.object({
    id: z.string().min(1),
  }),

  query: z.object({}),
});

const serviceIdSchema = z.object({
  body: z.object({}),

  params: z.object({
    id: z.string().min(1),
  }),

  query: z.object({}),
});

const listServicesSchema = z.object({
  body: z.object({}),

  params: z.object({}),

  query: z.object({
    category: z.string().optional(),

    search: z.string().trim().optional(),

    active: z.enum(["true", "false"]).optional(),
  }),
});

module.exports = {
  createServiceSchema,
  updateServiceSchema,
  serviceIdSchema,
  listServicesSchema,
};
