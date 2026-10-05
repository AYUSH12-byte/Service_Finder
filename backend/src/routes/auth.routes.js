const express = require("express");

const {
  register,
  login,
  refresh,
  logout,
} = require("../controllers/auth.controller");

const validate = require("../middleware/validate");

const {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  logoutSchema,
} = require("../validators/auth.validator");

const router = express.Router();

router.post("/register", validate(registerSchema), register);

router.post("/login", validate(loginSchema), login);

router.post("/refresh", validate(refreshTokenSchema), refresh);

router.post("/logout", validate(logoutSchema), logout);

module.exports = router;
