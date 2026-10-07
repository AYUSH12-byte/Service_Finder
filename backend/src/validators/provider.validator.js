const { z } = require("zod");

const timeRegex = /^(?:[01]\d|2[0-3]):[0-5]\d$/;

const availabilityDaySchema = z
  .object({
    enabled: z.boolean().optional(),
    startTime: z.string().regex(timeRegex, "Invalid start time").optional(),
    endTime: z.string().regex(timeRegex, "Invalid end time").optional(),
  })
  .optional();

const availabilitySchema = z
  .object({
    monday: availabilityDaySchema,
    tuesday: availabilityDaySchema,
    wednesday: availabilityDaySchema,
    thursday: availabilityDaySchema,
    friday: availabilityDaySchema,
    saturday: availabilityDaySchema,
    sunday: availabilityDaySchema,
  })
  .optional();

const createProviderProfileSchema = z.object({
  body: z.object({
    businessName: z.string().trim().min(2).max(150).optional(),

    bio: z.string().trim().max(2000).optional(),

    experienceYears: z.number().min(0).max(80).optional(),

    profileImage: z.string().trim().url().optional(),

    serviceAreas: z.array(z.string().trim().min(2).max(100)).max(20).optional(),

    availability: availabilitySchema,
  }),

  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

const updateProviderProfileSchema = z.object({
  body: createProviderProfileSchema.shape.body.partial().extend({
    serviceAreas: z.array(z.string().trim().min(2).max(100)).max(20).optional(),
  }),

  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

const providerDiscoverySchema = z.object({
  body: z.object({}).optional(),

  params: z.object({}).optional(),

  query: z.object({
    serviceId: z
      .string()
      .regex(
        /^[0-9a-fA-F]{24}$/,
        "Invalid service ID"
      )
      .optional(),

    serviceArea: z
      .string()
      .trim()
      .max(100)
      .optional(),

    search: z
      .string()
      .trim()
      .max(100)
      .optional(),

    minRating: z
      .coerce
      .number()
      .min(0)
      .max(5)
      .optional(),

    maxPrice: z
      .coerce
      .number()
      .min(0)
      .optional(),

    page: z
      .coerce
      .number()
      .int()
      .min(1)
      .default(1),

    limit: z
      .coerce
      .number()
      .int()
      .min(1)
      .max(50)
      .default(10),
  }),
});

module.exports = {
  createProviderProfileSchema,
  updateProviderProfileSchema,
  providerDiscoverySchema,
};
