const asyncHandler = require("../utils/asyncHandler");
const {
  createProviderProfile,
  getProviderProfileByUserId,
  updateProviderProfile,
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

module.exports = {
  createProfile,
  getMyProfile,
  updateMyProfile,
};
