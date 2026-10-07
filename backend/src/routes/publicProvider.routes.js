const express = require("express");

const validate = require("../middleware/validate");

const { discover } = require("../controllers/provider.controller");

const { providerDiscoverySchema } = require("../validators/provider.validator");

const router = express.Router();

router.get("/", validate(providerDiscoverySchema), discover);

module.exports = router;
