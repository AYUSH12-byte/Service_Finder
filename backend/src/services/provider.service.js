const { Provider } = require("../models/Provider");
const { User, USER_ROLES } = require("../models/User");
const { ProviderService } = require("../models/ProviderService");
const Service = require("../models/Service");
const AppError = require("../utils/AppError");

const {
  calculateProviderMatchScore,
} = require("../utils/providerMatching");

// Provider profile
const createProviderProfile = async (userId, profileData) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(
      "User account not found",
      404,
      "USER_NOT_FOUND"
    );
  }

  if (user.role !== USER_ROLES.PROVIDER) {
    throw new AppError(
      "Only provider accounts can create provider profiles",
      403,
      "PROVIDER_ROLE_REQUIRED"
    );
  }

  const existingProfile = await Provider.findOne({
    user: userId,
  });

  if (existingProfile) {
    throw new AppError(
      "Provider profile already exists",
      409,
      "PROVIDER_PROFILE_EXISTS"
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
      "PROVIDER_PROFILE_NOT_FOUND"
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
      "PROVIDER_PROFILE_NOT_FOUND"
    );
  }

  if (provider.verificationStatus === "SUSPENDED") {
    throw new AppError(
      "Suspended provider profiles cannot be updated",
      403,
      "PROVIDER_SUSPENDED"
    );
  }

  Object.assign(provider, profileData);

  await provider.save();

  return Provider.findById(provider._id).populate({
    path: "user",
    select:
      "firstName lastName email phone role status emailVerified phoneVerified",
  });
};

// Provider services
const addProviderService = async (userId, serviceData) => {
  const provider = await Provider.findOne({
    user: userId,
  });

  if (!provider) {
    throw new AppError(
      "Provider profile not found",
      404,
      "PROVIDER_PROFILE_NOT_FOUND"
    );
  }

  if (provider.verificationStatus === "SUSPENDED") {
    throw new AppError(
      "Suspended providers cannot add services",
      403,
      "PROVIDER_SUSPENDED"
    );
  }

  const service = await Service.findById(
    serviceData.serviceId
  );

  if (!service) {
    throw new AppError(
      "Service not found",
      404,
      "SERVICE_NOT_FOUND"
    );
  }

  if (!service.isActive) {
    throw new AppError(
      "This service is currently inactive",
      400,
      "SERVICE_INACTIVE"
    );
  }

  const existingProviderService =
    await ProviderService.findOne({
      provider: provider._id,
      service: service._id,
    });

  if (existingProviderService) {
    throw new AppError(
      "Provider already offers this service",
      409,
      "PROVIDER_SERVICE_EXISTS"
    );
  }

  const providerService =
    await ProviderService.create({
      provider: provider._id,
      service: service._id,
      price: serviceData.price,
      priceType: serviceData.priceType,
      experienceYears:
        serviceData.experienceYears ??
        provider.experienceYears,
      description:
        serviceData.description ?? null,
    });

  return ProviderService.findById(
    providerService._id
  ).populate({
    path: "service",
    select:
      "name slug description basePrice priceType category isActive",
    populate: {
      path: "category",
      select: "name slug",
    },
  });
};

const getMyProviderServices = async (
  userId,
  filters = {}
) => {
  const provider = await Provider.findOne({
    user: userId,
  });

  if (!provider) {
    throw new AppError(
      "Provider profile not found",
      404,
      "PROVIDER_PROFILE_NOT_FOUND"
    );
  }

  const query = {
    provider: provider._id,
  };

  if (typeof filters.active === "boolean") {
    query.isActive = filters.active;
  }

  const providerServices =
    await ProviderService.find(query)
      .populate({
        path: "service",
        select:
          "name slug description basePrice priceType category isActive",
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

const getProviderServiceById = async (
  userId,
  providerServiceId
) => {
  const provider = await Provider.findOne({
    user: userId,
  });

  if (!provider) {
    throw new AppError(
      "Provider profile not found",
      404,
      "PROVIDER_PROFILE_NOT_FOUND"
    );
  }

  const providerService =
    await ProviderService.findOne({
      _id: providerServiceId,
      provider: provider._id,
    }).populate({
      path: "service",
      select:
        "name slug description basePrice priceType category isActive",
      populate: {
        path: "category",
        select: "name slug",
      },
    });

  if (!providerService) {
    throw new AppError(
      "Provider service not found",
      404,
      "PROVIDER_SERVICE_NOT_FOUND"
    );
  }

  return providerService;
};

const updateProviderService = async (
  userId,
  providerServiceId,
  updateData
) => {
  const provider = await Provider.findOne({
    user: userId,
  });

  if (!provider) {
    throw new AppError(
      "Provider profile not found",
      404,
      "PROVIDER_PROFILE_NOT_FOUND"
    );
  }

  if (provider.verificationStatus === "SUSPENDED") {
    throw new AppError(
      "Suspended providers cannot update services",
      403,
      "PROVIDER_SUSPENDED"
    );
  }

  const providerService =
    await ProviderService.findOne({
      _id: providerServiceId,
      provider: provider._id,
    });

  if (!providerService) {
    throw new AppError(
      "Provider service not found",
      404,
      "PROVIDER_SERVICE_NOT_FOUND"
    );
  }

  Object.assign(providerService, updateData);

  await providerService.save();

  return ProviderService.findById(
    providerService._id
  ).populate({
    path: "service",
    select:
      "name slug description basePrice priceType category isActive",
    populate: {
      path: "category",
      select: "name slug",
    },
  });
};

const removeProviderService = async (
  userId,
  providerServiceId
) => {
  const provider = await Provider.findOne({
    user: userId,
  });

  if (!provider) {
    throw new AppError(
      "Provider profile not found",
      404,
      "PROVIDER_PROFILE_NOT_FOUND"
    );
  }

  const providerService =
    await ProviderService.findOne({
      _id: providerServiceId,
      provider: provider._id,
    });

  if (!providerService) {
    throw new AppError(
      "Provider service not found",
      404,
      "PROVIDER_SERVICE_NOT_FOUND"
    );
  }

  await providerService.deleteOne();

  return true;
};

// Helper: current availability

/*
 * This checks the provider's normal weekly availability.
 *
 * It is NOT appointment availability yet.
 *
 * Later, the Booking module can check:
 * - requested date
 * - requested time
 * - existing bookings
 * - blocked dates
 */
const isProviderCurrentlyAvailable = (provider) => {
  if (!provider.availability) {
    return false;
  }

  const now = new Date();

  const dayNames = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  const currentDay = dayNames[now.getDay()];

  const schedule =
    provider.availability[currentDay];

  if (!schedule || !schedule.enabled) {
    return false;
  }

  if (!schedule.startTime || !schedule.endTime) {
    return false;
  }

  const currentMinutes =
    now.getHours() * 60 +
    now.getMinutes();

  const [startHour, startMinute] =
    schedule.startTime.split(":").map(Number);

  const [endHour, endMinute] =
    schedule.endTime.split(":").map(Number);

  const startMinutes =
    startHour * 60 + startMinute;

  const endMinutes =
    endHour * 60 + endMinute;

  return (
    currentMinutes >= startMinutes &&
    currentMinutes <= endMinutes
  );
};

// Smart provider discovery
const discoverProviders = async (filters = {}) => {
  const {
    serviceId,
    serviceArea,
    search,
    minRating,
    maxPrice,
    latitude,
    longitude,
    maxDistanceKm = 50,
    page = 1,
    limit = 10,
  } = filters;

  // Step 1: Build provider query
  const providerQuery = {
    verificationStatus: "VERIFIED",
  };

  if (serviceArea) {
    providerQuery.serviceAreas = {
      $regex: serviceArea,
      $options: "i",
    };
  }

  if (minRating !== undefined) {
    providerQuery["stats.averageRating"] = {
      $gte: minRating,
    };
  }

  if (search) {
    providerQuery.$or = [
      {
        businessName: {
          $regex: search,
          $options: "i",
        },
      },
      {
        bio: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  // Step 2: Location filter
  //
  // MongoDB GeoJSON format:
  // [longitude, latitude]
  //
  // NOT:
  // [latitude, longitude]
  const hasLocation =
    latitude !== undefined &&
    longitude !== undefined;

  if (hasLocation) {
    providerQuery.location = {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [
            longitude,
            latitude,
          ],
        },
        $maxDistance: maxDistanceKm * 1000,
      },
    };
  }

  // Step 3: Fetch verified providers
  const providers = await Provider.find(
    providerQuery
  ).populate({
    path: "user",
    select:
      "firstName lastName profileImage status",
  });

  if (providers.length === 0) {
    return {
      providers: [],
      pagination: {
        page,
        limit,
        total: 0,
        totalPages: 0,
      },
    };
  }

  // Step 4: Find provider services
  const providerIds = providers.map(
    (provider) => provider._id
  );

  const serviceQuery = {
    provider: {
      $in: providerIds,
    },
    isActive: true,
  };

  if (serviceId) {
    serviceQuery.service = serviceId;
  }

  if (maxPrice !== undefined) {
    serviceQuery.price = {
      $lte: maxPrice,
    };
  }

  const providerServices =
    await ProviderService.find(
      serviceQuery
    ).populate({
      path: "service",
      select:
        "name slug description basePrice priceType category",
      populate: {
        path: "category",
        select: "name slug",
      },
    });

  // Step 5: Group services by provider
  const servicesByProvider = new Map();

  for (const providerService of providerServices) {
    const key =
      providerService.provider.toString();

    if (!servicesByProvider.has(key)) {
      servicesByProvider.set(key, []);
    }

    servicesByProvider
      .get(key)
      .push(providerService);
  }

  // Step 6: Remove providers without matching services
  let matchedProviders = providers
    .map((provider) => {
      const services =
        servicesByProvider.get(
          provider._id.toString()
        ) || [];

      return {
        provider,
        services,
      };
    })
    .filter((item) => {
      if (
        !serviceId &&
        maxPrice === undefined
      ) {
        return true;
      }

      return item.services.length > 0;
    });

  if (matchedProviders.length === 0) {
    return {
      providers: [],
      pagination: {
        page,
        limit,
        total: 0,
        totalPages: 0,
      },
    };
  }

  // Step 7: Find price range
  const allPrices = matchedProviders.flatMap(
    (item) =>
      item.services
        .map((service) => service.price)
        .filter(
          (price) =>
            typeof price === "number"
        )
  );

  const minProviderPrice =
    allPrices.length > 0
      ? Math.min(...allPrices)
      : 0;

  const maxProviderPrice =
    allPrices.length > 0
      ? Math.max(...allPrices)
      : 0;

  // Step 8: Calculate smart match score
  matchedProviders = matchedProviders.map(
    (item) => {
      const provider = item.provider;

      // Find the lowest price offered by this provider for the matching services.
      const providerPrices =
        item.services
          .map(
            (service) => service.price
          )
          .filter(
            (price) =>
              typeof price === "number"
          );

      const providerPrice =
        providerPrices.length > 0
          ? Math.min(...providerPrices)
          : null;

      // Calculate distance.
      //
      // When latitude/longitude are supplied,
      // MongoDB's $near orders by distance,
      // but for the actual score we calculate
      // distance using the Haversine formula.
      let distanceKm = null;

      if (
        hasLocation &&
        provider.location?.coordinates?.length ===
          2
      ) {
        const [
          providerLongitude,
          providerLatitude,
        ] = provider.location.coordinates;

        distanceKm = calculateDistanceKm(
          latitude,
          longitude,
          providerLatitude,
          providerLongitude
        );
      }

      // Check normal weekly availability.
      const isAvailable =
        isProviderCurrentlyAvailable(
          provider
        );

      // Calculate final score.
      const matchScore =
        calculateProviderMatchScore({
          rating:
            provider.stats
              ?.averageRating || 0,

          distanceKm,

          completedJobs:
            provider.stats
              ?.completedJobs || 0,

          responseRate:
            provider.stats
              ?.responseRate || 0,

          price: providerPrice,

          minPrice:
            minProviderPrice,

          maxPrice:
            maxProviderPrice,

          isAvailable,
        });

      return {
        provider,
        services: item.services,

        matchScore,

        matchingFactors: {
          rating:
            provider.stats
              ?.averageRating || 0,

          distanceKm:
            distanceKm !== null
              ? Math.round(
                  distanceKm * 100
                ) / 100
              : null,

          completedJobs:
            provider.stats
              ?.completedJobs || 0,

          responseRate:
            provider.stats
              ?.responseRate || 0,

          price: providerPrice,

          isAvailable,
        },
      };
    }
  );

  // Step 9: Sort by smart match score
  // Highest score appears first.
  matchedProviders.sort(
    (a, b) =>
      b.matchScore - a.matchScore
  );

  // Step 10: Pagination
  const total = matchedProviders.length;

  const skip = (page - 1) * limit;

  const paginatedProviders =
    matchedProviders.slice(
      skip,
      skip + limit
    );

  // Step 11: Response
  return {
    providers: paginatedProviders,

    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(
        total / limit
      ),
    },
  };
};

// Haversine distance
const calculateDistanceKm = (
  latitude1,
  longitude1,
  latitude2,
  longitude2
) => {
  const earthRadiusKm = 6371;

  const toRadians = (degrees) =>
    (degrees * Math.PI) / 180;

  const latitudeDifference = toRadians(
    latitude2 - latitude1
  );

  const longitudeDifference = toRadians(
    longitude2 - longitude1
  );

  const a =
    Math.sin(
      latitudeDifference / 2
    ) **
      2 +
    Math.cos(
      toRadians(latitude1)
    ) *
      Math.cos(
        toRadians(latitude2)
      ) *
      Math.sin(
        longitudeDifference / 2
      ) **
        2;

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return earthRadiusKm * c;
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

  discoverProviders,
};