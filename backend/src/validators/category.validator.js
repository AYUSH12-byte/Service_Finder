const { z } = require("zod");

const createCategorySchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Category name must be at least 2 characters")
      .max(100, "Category name cannot exceed 100 characters"),

    slug: z
      .string()
      .trim()
      .min(2, "Category slug is required")
      .max(100, "Category slug cannot exceed 100 characters")
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Slug must contain only lowercase letters, numbers, and hyphens",
      ),

    description: z.string().trim().max(500).optional(),

    icon: z.string().trim().max(100).optional(),

    image: z.string().trim().url().optional(),

    isActive: z.boolean().optional(),

    sortOrder: z.number().int().min(0).optional(),
  }),

  params: z.object({}),
  query: z.object({}),
});

const updateCategorySchema = z.object({
  body: z
    .object({
      name: z.string().trim().min(2).max(100).optional(),

      slug: z
        .string()
        .trim()
        .min(2)
        .max(100)
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
        .optional(),

      description: z.string().trim().max(500).nullable().optional(),

      icon: z.string().trim().max(100).nullable().optional(),

      image: z.string().trim().url().nullable().optional(),

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

const categoryIdSchema = z.object({
  body: z.object({}),

  params: z.object({
    id: z.string().min(1),
  }),

  query: z.object({}),
});

const listCategoriesSchema = z.object({
  body: z.object({}),

  params: z.object({}),

  query: z.object({
    search: z.string().trim().optional(),

    active: z.enum(["true", "false"]).optional(),
  }),
});

module.exports = {
  createCategorySchema,
  updateCategorySchema,
  categoryIdSchema,
  listCategoriesSchema,
};
