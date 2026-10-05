const express = require("express");

const {
  create,
  list,
  getOne,
  update,
  remove,
} = require("../controllers/category.controller");

const { authenticate, authorize } = require("../middleware/auth");

const validate = require("../middleware/validate");

const {
  createCategorySchema,
  updateCategorySchema,
  categoryIdSchema,
  listCategoriesSchema,
} = require("../validators/category.validator");

const router = express.Router();

/*
 * Public
 */
router.get("/", validate(listCategoriesSchema), list);

router.get("/:id", validate(categoryIdSchema), getOne);

/*
 * Admin
 */
router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  validate(createCategorySchema),
  create,
);

router.patch(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  validate(updateCategorySchema),
  update,
);

router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  validate(categoryIdSchema),
  remove,
);

module.exports = router;
