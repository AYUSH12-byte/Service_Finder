const express = require("express");

const { authenticate, authorize } = require("../middleware/auth");

const validate = require("../middleware/validate");

const { create } = require("../controllers/booking.controller");

const { createBookingSchema } = require("../validators/booking.validator");

const router = express.Router();

router.use(authenticate);
router.use(authorize("CUSTOMER"));

router.post("/", validate(createBookingSchema), create);

module.exports = router;
