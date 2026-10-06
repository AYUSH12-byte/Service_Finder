const { Provider } = require("../models/Provider");
const { User, USER_ROLES } = require("../models/User");
const AppError = require("../utils/AppError");

const createProviderProfile = async (userId, profileData) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User account not found", 404, "USER_NOT_FOUND");
  }

  if (user.role !== USER_ROLES.PROVIDER) {
    throw new AppError(
      "Only provider accounts can create provider profiles",
      403,
      "PROVIDER_ROLE_REQUIRED",
    );
  }

  const existingProfile = await Provider.findOne({
    user: userId,
  });

  if (existingProfile) {
    throw new AppError(
      "Provider profile already exists",
      409,
      "PROVIDER_PROFILE_EXISTS",
    );
  }

  const provider = await Provider.create({
    user: userId,
    ...profileData,
  });

  return provider;
};

const getProviderProfileByUserId = async (userId) => {
  const provider = await Provider.findOne({
    user: userId,
  }).populate({
    path: "user",
    select:
      "firstName lastName email phone role status emailVerified phoneVerified",
  });

  if (!provider) {
    throw new AppError(
      "Provider profile not found",
      404,
      "PROVIDER_PROFILE_NOT_FOUND",
    );
  }

  return provider;
};

const updateProviderProfile = async (userId, profileData) => {
  const provider = await Provider.findOne({
    user: userId,
  });

  if (!provider) {
    throw new AppError(
      "Provider profile not found",
      404,
      "PROVIDER_PROFILE_NOT_FOUND",
    );
  }

  if (provider.verificationStatus === "SUSPENDED") {
    throw new AppError(
      "Suspended provider profiles cannot be updated",
      403,
      "PROVIDER_SUSPENDED",
    );
  }

  Object.assign(provider, profileData);

  await provider.save();

  return provider;
};

module.exports = {
  createProviderProfile,
  getProviderProfileByUserId,
  updateProviderProfile,
};
