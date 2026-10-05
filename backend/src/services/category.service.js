const Category = require("../models/Category");
const Service = require("../models/Service");
const AppError = require("../utils/AppError");

const createCategory = async (data) => {
  const existing = await Category.findOne({
    $or: [{ name: data.name }, { slug: data.slug }],
  });

  if (existing) {
    throw new AppError(
      "Category with this name or slug already exists",
      409,
      "CATEGORY_ALREADY_EXISTS",
    );
  }

  return Category.create(data);
};

const getCategories = async ({ search, active }) => {
  const filter = {};

  if (active !== undefined) {
    filter.isActive = active === "true";
  }

  if (search) {
    filter.$text = {
      $search: search,
    };
  }

  return Category.find(filter)
    .sort({
      sortOrder: 1,
      name: 1,
    })
    .lean();
};

const getCategoryById = async (id) => {
  const category = await Category.findById(id);

  if (!category) {
    throw new AppError("Category not found", 404, "CATEGORY_NOT_FOUND");
  }

  return category;
};

const updateCategory = async (id, updateData) => {
  const category = await Category.findById(id);

  if (!category) {
    throw new AppError("Category not found", 404, "CATEGORY_NOT_FOUND");
  }

  if (updateData.name || updateData.slug) {
    const duplicate = await Category.findOne({
      _id: { $ne: id },
      $or: [
        ...(updateData.name ? [{ name: updateData.name }] : []),
        ...(updateData.slug ? [{ slug: updateData.slug }] : []),
      ],
    });

    if (duplicate) {
      throw new AppError(
        "Category with this name or slug already exists",
        409,
        "CATEGORY_ALREADY_EXISTS",
      );
    }
  }

  Object.assign(category, updateData);

  await category.save();

  return category;
};

const deleteCategory = async (id) => {
  const category = await Category.findById(id);

  if (!category) {
    throw new AppError("Category not found", 404, "CATEGORY_NOT_FOUND");
  }

  const serviceCount = await Service.countDocuments({
    category: id,
  });

  if (serviceCount > 0) {
    throw new AppError(
      "Cannot delete a category containing services. Deactivate it instead.",
      409,
      "CATEGORY_HAS_SERVICES",
    );
  }

  await category.deleteOne();
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
