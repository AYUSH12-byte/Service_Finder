const calculateRatingScore = (rating = 0) => {
  return Math.min(
    Math.max(rating / 5, 0),
    1
  );
};

const calculateDistanceScore = (
  distanceKm,
  maxDistanceKm = 50
) => {
  if (
    distanceKm === null ||
    distanceKm === undefined
  ) {
    return 0;
  }

  if (distanceKm >= maxDistanceKm) {
    return 0;
  }

  return Math.max(
    1 - distanceKm / maxDistanceKm,
    0
  );
};

const calculateCompletedJobsScore = (
  completedJobs = 0
) => {
  const normalized =
    Math.min(completedJobs / 100, 1);

  return normalized;
};

const calculateResponseRateScore = (
  responseRate = 0
) => {
  return Math.min(
    Math.max(responseRate / 100, 0),
    1
  );
};

const calculatePriceScore = (
  price,
  minPrice,
  maxPrice
) => {
  if (
    price === null ||
    price === undefined ||
    minPrice === maxPrice
  ) {
    return 1;
  }

  return Math.max(
    1 -
      (price - minPrice) /
        (maxPrice - minPrice),
    0
  );
};

const calculateAvailabilityScore = (
  isAvailable
) => {
  return isAvailable ? 1 : 0;
};

const calculateProviderMatchScore = ({
  rating = 0,
  distanceKm = null,
  completedJobs = 0,
  responseRate = 0,
  price = null,
  minPrice = 0,
  maxPrice = 0,
  isAvailable = false,
}) => {
  const ratingScore =
    calculateRatingScore(rating);

  const distanceScore =
    calculateDistanceScore(distanceKm);

  const completedJobsScore =
    calculateCompletedJobsScore(
      completedJobs
    );

  const responseRateScore =
    calculateResponseRateScore(
      responseRate
    );

  const priceScore =
    calculatePriceScore(
      price,
      minPrice,
      maxPrice
    );

  const availabilityScore =
    calculateAvailabilityScore(
      isAvailable
    );

  const score =
    ratingScore * 30 +
    distanceScore * 25 +
    completedJobsScore * 15 +
    responseRateScore * 10 +
    priceScore * 10 +
    availabilityScore * 10;

  return Math.round(score * 100) / 100;
};

module.exports = {
  calculateProviderMatchScore,
};