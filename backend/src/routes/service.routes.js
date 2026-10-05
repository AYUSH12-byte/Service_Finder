const express = require("express");

const {
  create,
  list,
  getOne,
  update,
  remove,
} = require("../controllers/service.controller");

const { authenticate, authorize } = require("../middleware/auth");

const validate = require("../middleware/validate");

const {
  createServiceSchema,
  updateServiceSchema,
  serviceIdSchema,
  listServicesSchema,
} = require("../validators/service.validator");

const router = express.Router();

/*
 * Public
 */
router.get("/", validate(listServicesSchema), list);

router.get("/:id", validate(serviceIdSchema), getOne);

/*
 * Admin
 */
router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  validate(createServiceSchema),
  create,
);

router.patch(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  validate(updateServiceSchema),
  update,
);

router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  validate(serviceIdSchema),
  remove,
);

module.exports = router;
