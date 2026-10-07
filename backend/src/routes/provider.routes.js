const express = require("express");

const {
  authenticate,
  authorize,
} = require("../middleware/auth");

const validate = require("../middleware/validate");

const {
  createProfile,
  getMyProfile,
  updateMyProfile,
  addService,
  getMyServices,
  getMyService,
  updateMyService,
  removeMyService,
} = require("../controllers/provider.controller");

const {
  createProviderProfileSchema,
  updateProviderProfileSchema,
} = require("../validators/provider.validator");

const {
  createProviderServiceSchema,
  updateProviderServiceSchema,
  providerServiceIdSchema,
} = require("../validators/providerService.validator");

const router = express.Router();

router.use(
  authenticate,
  authorize("PROVIDER")
);

// Provider Profile
router.post(
  "/profile",
  validate(createProviderProfileSchema),
  createProfile
);

router.get(
  "/profile",
  getMyProfile
);

router.patch(
  "/profile",
  validate(updateProviderProfileSchema),
  updateMyProfile
);

// Provider Services
router.post(
  "/services",
  validate(createProviderServiceSchema),
  addService
);

router.get(
  "/services",
  getMyServices
);


router.get(
  "/services/:id",
  validate(providerServiceIdSchema),
  getMyService
);

router.patch(
  "/services/:id",
  validate(updateProviderServiceSchema),
  updateMyService
);

router.delete(
  "/services/:id",
  validate(providerServiceIdSchema),
  removeMyService
);

module.exports = router;