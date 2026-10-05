const Service = require("../models/Service");
const Category = require("../models/Category");
const AppError = require("../utils/AppError");

const createService = async (data) => {
  const category = await Category.findById(data.category);

  if (!category) {
    throw new AppError("Category not found", 404, "CATEGORY_NOT_FOUND");
  }

  if (!category.isActive) {
    throw new AppError(
      "Cannot create a service under an inactive category",
      400,
      "CATEGORY_INACTIVE",
    );
  }

  const existing = await Service.findOne({
    $or: [{ name: data.name }, { slug: data.slug }],
  });

  if (existing) {
    throw new AppError(
      "Service with this name or slug already exists",
      409,
      "SERVICE_ALREADY_EXISTS",
    );
  }

  return Service.create(data);
};

const getServices = async ({ category, search, active }) => {
  const filter = {};

  if (category) {
    filter.category = category;
  }

  if (active !== undefined) {
    filter.isActive = active === "true";
  }

  if (search) {
    filter.$text = {
      $search: search,
    };
  }

  return Service.find(filter)
    .populate("category", "name slug")
    .sort({
      sortOrder: 1,
      name: 1,
    })
    .lean();
};

const getServiceById = async (id) => {
  const service = await Service.findById(id).populate("category", "name slug");

  if (!service) {
    throw new AppError("Service not found", 404, "SERVICE_NOT_FOUND");
  }

  return service;
};

const updateService = async (id, updateData) => {
  const service = await Service.findById(id);

  if (!service) {
    throw new AppError("Service not found", 404, "SERVICE_NOT_FOUND");
  }

  if (updateData.category) {
    const category = await Category.findById(updateData.category);

    if (!category) {
      throw new AppError("Category not found", 404, "CATEGORY_NOT_FOUND");
    }

    if (!category.isActive) {
      throw new AppError(
        "Cannot move service to an inactive category",
        400,
        "CATEGORY_INACTIVE",
      );
    }
  }

  if (updateData.name || updateData.slug) {
    const duplicate = await Service.findOne({
      _id: { $ne: id },
      $or: [
        ...(updateData.name ? [{ name: updateData.name }] : []),
        ...(updateData.slug ? [{ slug: updateData.slug }] : []),
      ],
    });

    if (duplicate) {
      throw new AppError(
        "Service with this name or slug already exists",
        409,
        "SERVICE_ALREADY_EXISTS",
      );
    }
  }

  Object.assign(service, updateData);

  await service.save();

  return service;
};

const deleteService = async (id) => {
  const service = await Service.findById(id);

  if (!service) {
    throw new AppError("Service not found", 404, "SERVICE_NOT_FOUND");
  }

  await service.deleteOne();
};

module.exports = {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
};
