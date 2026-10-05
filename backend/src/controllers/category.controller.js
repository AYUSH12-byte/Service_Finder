const asyncHandler = require("../utils/asyncHandler");
const { successResponse, createdResponse } = require("../utils/apiResponse");

const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../services/category.service");

const create = asyncHandler(async (req, res) => {
  const category = await createCategory(req.validated.body);

  return createdResponse({
    res,
    message: "Category created successfully",
    data: { category },
  });
});

const list = asyncHandler(async (req, res) => {
  const categories = await getCategories(req.validated.query);

  return successResponse({
    res,
    message: "Categories retrieved successfully",
    data: { categories },
  });
});

const getOne = asyncHandler(async (req, res) => {
  const category = await getCategoryById(req.validated.params.id);

  return successResponse({
    res,
    message: "Category retrieved successfully",
    data: { category },
  });
});

const update = asyncHandler(async (req, res) => {
  const category = await updateCategory(
    req.validated.params.id,
    req.validated.body,
  );

  return successResponse({
    res,
    message: "Category updated successfully",
    data: { category },
  });
});

const remove = asyncHandler(async (req, res) => {
  await deleteCategory(req.validated.params.id);

  return successResponse({
    res,
    message: "Category deleted successfully",
  });
});

module.exports = {
  create,
  list,
  getOne,
  update,
  remove,
};
