const express = require("express");

const { authenticate, authorize } = require("../middleware/auth");

const validate = require("../middleware/validate");

const {
  getAllProviders,
  getProvider,
  verify,
  reject,
  suspend,
} = require("../controllers/adminProvider.controller");

const {
  providerIdSchema,
  providerVerificationSchema,
  providerListSchema,
} = require("../validators/adminProvider.validator");

const router = express.Router();

router.use(authenticate, authorize("ADMIN"));

router.get("/", validate(providerListSchema), getAllProviders);

router.get("/:id", validate(providerIdSchema), getProvider);

router.patch("/:id/verify", validate(providerVerificationSchema), verify);

router.patch("/:id/reject", validate(providerVerificationSchema), reject);

router.patch("/:id/suspend", validate(providerVerificationSchema), suspend);

module.exports = router;
