const { z } = require("zod");

const PRICE_TYPES = [
  "FIXED",
  "HOURLY",
  "STARTING_FROM",
  "CUSTOM_QUOTE",
];

const createProviderServiceSchema = z.object({
  body: z.object({
    serviceId: z
      .string()
      .regex(
        /^[0-9a-fA-F]{24}$/,
        "Invalid service ID"
      ),

    price: z
      .number()
      .min(0, "Price cannot be negative"),

    priceType: z
      .enum(PRICE_TYPES)
      .default("CUSTOM_QUOTE"),

    experienceYears: z
      .number()
      .min(0)
      .max(80)
      .optional(),

    description: z
      .string()
      .trim()
      .max(1000)
      .optional(),
  }),

  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

const updateProviderServiceSchema = z.object({
  body: z.object({
    price: z
      .number()
      .min(0)
      .optional(),

    priceType: z
      .enum(PRICE_TYPES)
      .optional(),

    experienceYears: z
      .number()
      .min(0)
      .max(80)
      .optional(),

    description: z
      .string()
      .trim()
      .max(1000)
      .nullable()
      .optional(),

    isActive: z
      .boolean()
      .optional(),
  }),

  params: z.object({
    id: z
      .string()
      .regex(
        /^[0-9a-fA-F]{24}$/,
        "Invalid provider service ID"
      ),
  }),

  query: z.object({}).optional(),
});

const providerServiceIdSchema = z.object({
  body: z.object({}).optional(),

  params: z.object({
    id: z
      .string()
      .regex(
        /^[0-9a-fA-F]{24}$/,
        "Invalid provider service ID"
      ),
  }),

  query: z.object({}).optional(),
});

module.exports = {
  createProviderServiceSchema,
  updateProviderServiceSchema,
  providerServiceIdSchema,
};