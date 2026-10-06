const express = require("express");

const { authenticate, authorize } = require("../middleware/auth");

const validate = require("../middleware/validate");

const {
  createProfile,
  getMyProfile,
  updateMyProfile,
} = require("../controllers/provider.controller");

const {
  createProviderProfileSchema,
  updateProviderProfileSchema,
} = require("../validators/provider.validator");

const router = express.Router();

router.use(authenticate, authorize("PROVIDER"));

router.post("/profile", validate(createProviderProfileSchema), createProfile);

router.get("/profile", getMyProfile);

router.patch(
  "/profile",
  validate(updateProviderProfileSchema),
  updateMyProfile,
);

module.exports = router;
