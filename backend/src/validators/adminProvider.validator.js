const { z } = require("zod");

const providerIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid provider ID"),
  }),

  body: z.object({}).optional(),
  query: z.object({}).optional(),
});

const providerVerificationSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid provider ID"),
  }),

  body: z.object({
    reason: z.string().trim().max(1000).optional(),
  }),

  query: z.object({}).optional(),
});

const providerListSchema = z.object({
  body: z.object({}).optional(),

  params: z.object({}).optional(),

  query: z.object({
    verificationStatus: z
      .enum(["PENDING", "VERIFIED", "REJECTED", "SUSPENDED"])
      .optional(),

    kycStatus: z
      .enum(["NOT_SUBMITTED", "PENDING", "VERIFIED", "REJECTED"])
      .optional(),

    search: z.string().trim().optional(),
  }),
});

module.exports = {
  providerIdSchema,
  providerVerificationSchema,
  providerListSchema,
};
