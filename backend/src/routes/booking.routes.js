const express = require("express");

const { authenticate, authorize } = require("../middleware/auth");

const validate = require("../middleware/validate");

const { create, list, getOne } = require("../controllers/booking.controller");

const {
  createBookingSchema,
  bookingIdSchema,
  listBookingsSchema,
} = require("../validators/booking.validator");

const router = express.Router();

router.use(authenticate);
router.use(authorize("CUSTOMER", "PROVIDER"));

router.get("/", validate(listBookingsSchema), list);

router.post("/", authorize("CUSTOMER"), validate(createBookingSchema), create);

router.get("/:id", validate(bookingIdSchema), getOne);

module.exports = router;
