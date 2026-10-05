const asyncHandler = require("../utils/asyncHandler");
const {
  successResponse,
  createdResponse,
} = require("../utils/apiResponse");

const {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
} = require("../services/service.service");

const create = asyncHandler(
  async (req, res) => {
    const service =
      await createService(
        req.validated.body
      );

    return createdResponse({
      res,
      message: "Service created successfully",
      data: { service },
    });
  }
);

const list = asyncHandler(
  async (req, res) => {
    const services =
      await getServices(
        req.validated.query
      );

    return successResponse({
      res,
      message: "Services retrieved successfully",
      data: { services },
    });
  }
);

const getOne = asyncHandler(
  async (req, res) => {
    const service =
      await getServiceById(
        req.validated.params.id
      );

    return successResponse({
      res,
      message: "Service retrieved successfully",
      data: { service },
    });
  }
);

const update = asyncHandler(
  async (req, res) => {
    const service =
      await updateService(
        req.validated.params.id,
        req.validated.body
      );

    return successResponse({
      res,
      message: "Service updated successfully",
      data: { service },
    });
  }
);

const remove = asyncHandler(
  async (req, res) => {
    await deleteService(
      req.validated.params.id
    );

    return successResponse({
      res,
      message: "Service deleted successfully",
    });
  }
);

module.exports = {
  create,
  list,
  getOne,
  update,
  remove,
};