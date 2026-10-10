
const { z } = require("zod");

const objectIdRegex = /^[0-9a-fA-F]{24}$/;
const objectIdSchema = z.string().regex(objectIdRegex, "Invalid booking ID");

const initiatePaymentSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
  body: z.object({
    method: z.enum(["CASH", "ESEWA", "KHALTI"]),
  }),
  query: z.object({}),
});

const bookingPaymentSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
  body: z.object({}),
  query: z.object({}),
});

module.exports = {
  initiatePaymentSchema,
  bookingPaymentSchema,
};
