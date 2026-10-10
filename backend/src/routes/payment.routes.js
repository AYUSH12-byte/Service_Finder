const express = require("express");

const { authenticate, authorize } = require("../middleware/auth");
const validate = require("../middleware/validate");

const {
  initiate,
  confirmCash,
  getDetails,
} = require("../controllers/payment.controller");

const {
  initiatePaymentSchema,
  bookingPaymentSchema,
} = require("../validators/payment.validator");

const router = express.Router();

router.use(authenticate);

router.post(
  "/bookings/:id/initiate",
  authorize("CUSTOMER"),
  validate(initiatePaymentSchema),
  initiate,
);

router.patch(
  "/bookings/:id/confirm-cash",
  authorize("PROVIDER"),
  validate(bookingPaymentSchema),
  confirmCash,
);

router.get(
  "/bookings/:id",
  authorize("CUSTOMER", "PROVIDER"),
  validate(bookingPaymentSchema),
  getDetails,
);

module.exports = router;
