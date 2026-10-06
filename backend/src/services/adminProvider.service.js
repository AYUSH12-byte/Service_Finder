const {
  Provider,
  PROVIDER_VERIFICATION_STATUS,
} = require("../models/Provider");

const AppError = require("../utils/AppError");

const getProviders = async (filters = {}) => {
  const query = {};

  if (filters.verificationStatus) {
    query.verificationStatus = filters.verificationStatus;
  }

  if (filters.kycStatus) {
    query["kyc.status"] = filters.kycStatus;
  }

  const providers = await Provider.find(query)
    .populate({
      path: "user",
      select:
        "firstName lastName email phone role status emailVerified phoneVerified createdAt",
    })
    .sort({ createdAt: -1 });

  if (filters.search) {
    const search = filters.search.toLowerCase();

    return providers.filter((provider) => {
      const businessName = provider.businessName?.toLowerCase() || "";

      const firstName = provider.user?.firstName?.toLowerCase() || "";

      const lastName = provider.user?.lastName?.toLowerCase() || "";

      const email = provider.user?.email?.toLowerCase() || "";

      return (
        businessName.includes(search) ||
        firstName.includes(search) ||
        lastName.includes(search) ||
        email.includes(search)
      );
    });
  }

  return providers;
};

const getProviderById = async (providerId) => {
  const provider = await Provider.findById(providerId).populate({
    path: "user",
    select:
      "firstName lastName email phone role status emailVerified phoneVerified createdAt",
  });

  if (!provider) {
    throw new AppError("Provider not found", 404, "PROVIDER_NOT_FOUND");
  }

  return provider;
};

const verifyProvider = async (providerId, adminId) => {
  const provider = await Provider.findById(providerId);

  if (!provider) {
    throw new AppError("Provider not found", 404, "PROVIDER_NOT_FOUND");
  }

  if (provider.verificationStatus === PROVIDER_VERIFICATION_STATUS.SUSPENDED) {
    throw new AppError(
      "Suspended provider cannot be verified directly",
      400,
      "PROVIDER_SUSPENDED",
    );
  }

  provider.verificationStatus = PROVIDER_VERIFICATION_STATUS.VERIFIED;

  provider.verificationReason = null;
  provider.verifiedAt = new Date();
  provider.verifiedBy = adminId;

  provider.kyc.status = "VERIFIED";
  provider.kyc.reviewedAt = new Date();
  provider.kyc.reviewedBy = adminId;
  provider.kyc.rejectionReason = null;

  await provider.save();

  return provider;
};

const rejectProvider = async (providerId, adminId, reason) => {
  const provider = await Provider.findById(providerId);

  if (!provider) {
    throw new AppError("Provider not found", 404, "PROVIDER_NOT_FOUND");
  }

  provider.verificationStatus = PROVIDER_VERIFICATION_STATUS.REJECTED;

  provider.verificationReason = reason || "Provider verification rejected";

  provider.verifiedAt = null;
  provider.verifiedBy = null;

  provider.kyc.status = "REJECTED";
  provider.kyc.reviewedAt = new Date();
  provider.kyc.reviewedBy = adminId;
  provider.kyc.rejectionReason = reason || "KYC verification rejected";

  await provider.save();

  return provider;
};

const suspendProvider = async (providerId, adminId, reason) => {
  const provider = await Provider.findById(providerId);

  if (!provider) {
    throw new AppError("Provider not found", 404, "PROVIDER_NOT_FOUND");
  }

  provider.verificationStatus = PROVIDER_VERIFICATION_STATUS.SUSPENDED;

  provider.verificationReason = reason || "Provider account suspended";

  provider.verifiedBy = adminId;

  await provider.save();

  return provider;
};

module.exports = {
  getProviders,
  getProviderById,
  verifyProvider,
  rejectProvider,
  suspendProvider,
};
