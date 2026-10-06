const { Provider } = require("../models/Provider");

const { User, USER_ROLES } = require("../models/User");

const { ProviderService } = require("../models/ProviderService");

const Service = require("../models/Service");

const AppError = require("../utils/AppError");

// Provider profile
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

  return Provider.findById(provider._id).populate({
    path: "user",
    select:
      "firstName lastName email phone role status emailVerified phoneVerified",
  });
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

  // Only fields allowed by the validator should reach here.
  // Object.assign updates only those supplied fields.
  Object.assign(provider, profileData);

  await provider.save();

  return Provider.findById(provider._id).populate({
    path: "user",
    select:
      "firstName lastName email phone role status emailVerified phoneVerified",
  });
};

// Add provider service
const addProviderService = async (userId, serviceData) => {
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
      "Suspended providers cannot add services",
      403,
      "PROVIDER_SUSPENDED",
    );
  }

  const service = await Service.findById(serviceData.serviceId);

  if (!service) {
    throw new AppError("Service not found", 404, "SERVICE_NOT_FOUND");
  }

  if (!service.isActive) {
    throw new AppError(
      "This service is currently inactive",
      400,
      "SERVICE_INACTIVE",
    );
  }

  const existingProviderService = await ProviderService.findOne({
    provider: provider._id,
    service: service._id,
  });

  if (existingProviderService) {
    throw new AppError(
      "Provider already offers this service",
      409,
      "PROVIDER_SERVICE_EXISTS",
    );
  }

  const providerService = await ProviderService.create({
    provider: provider._id,

    service: service._id,

    price: serviceData.price,

    priceType: serviceData.priceType,

    experienceYears: serviceData.experienceYears ?? provider.experienceYears,

    description: serviceData.description ?? null,
  });

  return ProviderService.findById(providerService._id).populate({
    path: "service",
    select: "name slug description basePrice priceType category isActive",
    populate: {
      path: "category",
      select: "name slug",
    },
  });
};

// Get provider services
const getMyProviderServices = async (userId, filters = {}) => {
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

  const query = {
    provider: provider._id,
  };

  if (typeof filters.active === "boolean") {
    query.isActive = filters.active;
  }

  const providerServices = await ProviderService.find(query)
    .populate({
      path: "service",
      select: "name slug description basePrice priceType category isActive",
      populate: {
        path: "category",
        select: "name slug",
      },
    })
    .sort({
      createdAt: -1,
    });

  return providerServices;
};

// Get single provider service
const getProviderServiceById = async (userId, providerServiceId) => {
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

  const providerService = await ProviderService.findOne({
    _id: providerServiceId,

    provider: provider._id,
  }).populate({
    path: "service",
    select: "name slug description basePrice priceType category isActive",
    populate: {
      path: "category",
      select: "name slug",
    },
  });

  if (!providerService) {
    throw new AppError(
      "Provider service not found",
      404,
      "PROVIDER_SERVICE_NOT_FOUND",
    );
  }

  return providerService;
};

// Update provider service
const updateProviderService = async (userId, providerServiceId, updateData) => {
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
      "Suspended providers cannot update services",
      403,
      "PROVIDER_SUSPENDED",
    );
  }

  const providerService = await ProviderService.findOne({
    _id: providerServiceId,

    provider: provider._id,
  });

  if (!providerService) {
    throw new AppError(
      "Provider service not found",
      404,
      "PROVIDER_SERVICE_NOT_FOUND",
    );
  }

  Object.assign(providerService, updateData);

  await providerService.save();

  return ProviderService.findById(providerService._id).populate({
    path: "service",
    select: "name slug description basePrice priceType category isActive",
    populate: {
      path: "category",
      select: "name slug",
    },
  });
};

// Remove provider service
const removeProviderService = async (userId, providerServiceId) => {
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

  const providerService = await ProviderService.findOne({
    _id: providerServiceId,

    provider: provider._id,
  });

  if (!providerService) {
    throw new AppError(
      "Provider service not found",
      404,
      "PROVIDER_SERVICE_NOT_FOUND",
    );
  }

  await providerService.deleteOne();

  return true;
};

// Export services
module.exports = {
  createProviderProfile,
  getProviderProfileByUserId,
  updateProviderProfile,

  addProviderService,
  getMyProviderServices,
  getProviderServiceById,
  updateProviderService,
  removeProviderService,
};
