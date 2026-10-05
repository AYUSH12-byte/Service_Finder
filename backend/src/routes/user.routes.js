const express = require("express");

const {
  getMe,
  updateMe,
  updatePassword,
} = require("../controllers/user.controller");

const { authenticate } = require("../middleware/auth");

const validate = require("../middleware/validate");

const {
  getMeSchema,
  updateProfileSchema,
  changePasswordSchema,
} = require("../validators/user.validator");

const router = express.Router();

router.get("/me", authenticate, validate(getMeSchema), getMe);

router.patch("/me", authenticate, validate(updateProfileSchema), updateMe);

router.patch(
  "/me/password",
  authenticate,
  validate(changePasswordSchema),
  updatePassword,
);

module.exports = router;
