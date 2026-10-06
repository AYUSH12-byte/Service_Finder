const asyncHandler = require("../utils/asyncHandler");

const {
  getProviders,
  getProviderById,
  verifyProvider,
  rejectProvider,
  suspendProvider,
} = require("../services/adminProvider.service");

const {
  successResponse,
} = require("../utils/apiResponse");

const getAllProviders = asyncHandler(
  async (req, res) => {
    const providers = await getProviders(
      req.validated.query
    );

    return successResponse({
      res,
      message:
        "Providers retrieved successfully",
      data: {
        providers,
      },
    });
  }
);

const getProvider = asyncHandler(
  async (req, res) => {
    const provider =
      await getProviderById(
        req.validated.params.id
      );

    return successResponse({
      res,
      message:
        "Provider retrieved successfully",
      data: {
        provider,
      },
    });
  }
);

const verify = asyncHandler(
  async (req, res) => {
    const provider =
      await verifyProvider(
        req.validated.params.id,
        req.user.id
      );

    return successResponse({
      res,
      message:
        "Provider verified successfully",
      data: {
        provider,
      },
    });
  }
);

const reject = asyncHandler(
  async (req, res) => {
    const provider =
      await rejectProvider(
        req.validated.params.id,
        req.user.id,
        req.validated.body.reason
      );

    return successResponse({
      res,
      message:
        "Provider verification rejected",
      data: {
        provider,
      },
    });
  }
);

const suspend = asyncHandler(
  async (req, res) => {
    const provider =
      await suspendProvider(
        req.validated.params.id,
        req.user.id,
        req.validated.body.reason
      );

    return successResponse({
      res,
      message:
        "Provider suspended successfully",
      data: {
        provider,
      },
    });
  }
);

module.exports = {
  getAllProviders,
  getProvider,
  verify,
  reject,
  suspend,
};