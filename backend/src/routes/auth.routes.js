const express = require("express");

const validate = require("../middleware/validate");
const { registerSchema } = require("../validators/auth.validator");
const { register } = require("../controllers/auth.controller");

const router = express.Router();

router.post("/register", validate(registerSchema), register);

module.exports = router;
