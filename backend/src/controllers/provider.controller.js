const asyncHandler = require("../utils/asyncHandler");
const {
  addProviderService,
  getMyProviderServices,
  getProviderServiceById,
  updateProviderService,
  removeProviderService,
} = require("../services/provider.service");
const { createdResponse, successResponse } = require("../utils/apiResponse");

const createProfile = asyncHandler(async (req, res) => {
  const provider = await createProviderProfile(req.user.id, req.validated.body);

  return createdResponse({
    res,
    message: "Provider profile created successfully",
    data: {
      provider,
    },
  });
});

const getMyProfile = asyncHandler(async (req, res) => {
  const provider = await getProviderProfileByUserId(req.user.id);

  return successResponse({
    res,
    message: "Provider profile retrieved successfully",
    data: {
      provider,
    },
  });
});

const updateMyProfile = asyncHandler(async (req, res) => {
  const provider = await updateProviderProfile(req.user.id, req.validated.body);

  return successResponse({
    res,
    message: "Provider profile updated successfully",
    data: {
      provider,
    },
  });
});

const addService = asyncHandler(async (req, res) => {
  const providerService = await addProviderService(
    req.user.id,
    req.validated.body,
  );

  return createdResponse({
    res,
    message: "Service added to provider profile successfully",
    data: {
      providerService,
    },
  });
});

const getMyServices = asyncHandler(async (req, res) => {
  const providerServices = await getMyProviderServices(
    req.user.id,
    req.validated?.query || {},
  );

  return successResponse({
    res,
    message: "Provider services retrieved successfully",
    data: {
      providerServices,
    },
  });
});

const getMyService = asyncHandler(async (req, res) => {
  const providerService = await getProviderServiceById(
    req.user.id,
    req.validated.params.id,
  );

  return successResponse({
    res,
    message: "Provider service retrieved successfully",
    data: {
      providerService,
    },
  });
});

const updateMyService = asyncHandler(async (req, res) => {
  const providerService = await updateProviderService(
    req.user.id,
    req.validated.params.id,
    req.validated.body,
  );

  return successResponse({
    res,
    message: "Provider service updated successfully",
    data: {
      providerService,
    },
  });
});

const removeMyService = asyncHandler(
  async (req, res) => {
    await removeProviderService(
      req.user.id,
      req.validated.params.id
    );

    return successResponse({
      res,
      message:
        "Service removed from provider profile successfully",
    });
  }
);

module.exports = {
  createProfile,
  getMyProfile,
  updateMyProfile,

  addService,
  getMyServices,
  getMyService,
  updateMyService,
  removeMyService,
};
