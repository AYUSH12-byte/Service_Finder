const crypto = require("crypto");

const { Booking, BOOKING_STATUS } = require("../models/Booking");
const {
  Provider,
  PROVIDER_VERIFICATION_STATUS,
} = require("../models/Provider");
const { ProviderService } = require("../models/ProviderService");
const { Service } = require("../models/Service");
const { User, USER_ROLES, USER_STATUS } = require("../models/User");
const AppError = require("../utils/AppError");

const ACTIVE_BOOKING_STATUSES = [
  BOOKING_STATUS.PENDING,
  BOOKING_STATUS.ACCEPTED,
  BOOKING_STATUS.SCHEDULED,
  BOOKING_STATUS.PROVIDER_ON_WAY,
  BOOKING_STATUS.IN_PROGRESS,
];

const generateBookingNumber = () => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");

  const suffix = crypto.randomBytes(4).toString("hex").toUpperCase();

  return `SFB-${date}-${suffix}`;
};

const getDayName = (date) => {
  return [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ][date.getDay()];
};

const minutesFromTime = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const createBooking = async (customerId, bookingData) => {
  const customer = await User.findById(customerId);

  if (!customer || customer.role !== USER_ROLES.CUSTOMER) {
    throw new AppError(
      "Only customer accounts can create bookings",
      403,
      "CUSTOMER_ONLY",
    );
  }

  if (customer.status !== USER_STATUS.ACTIVE) {
    throw new AppError("Your account is not active", 403, "ACCOUNT_INACTIVE");
  }

  const provider = await Provider.findById(bookingData.providerId).populate(
    "user",
    "status role",
  );

  if (!provider) {
    throw new AppError("Provider not found", 404, "PROVIDER_NOT_FOUND");
  }

  if (provider.verificationStatus !== PROVIDER_VERIFICATION_STATUS.VERIFIED) {
    throw new AppError(
      "This provider is not verified for bookings",
      409,
      "PROVIDER_NOT_VERIFIED",
    );
  }

  if (!provider.user || provider.user.status !== USER_STATUS.ACTIVE) {
    throw new AppError(
      "This provider account is not active",
      409,
      "PROVIDER_INACTIVE",
    );
  }

  const providerService = await ProviderService.findOne({
    _id: bookingData.providerServiceId,
    provider: provider._id,
    isActive: true,
  }).populate("service");

  if (!providerService) {
    throw new AppError(
      "The provider does not offer this active service",
      404,
      "PROVIDER_SERVICE_NOT_FOUND",
    );
  }

  const service = providerService.service;

  if (!service || !service.isActive) {
    throw new AppError(
      "This service is currently unavailable",
      409,
      "SERVICE_INACTIVE",
    );
  }

  const scheduledDate = new Date(bookingData.scheduledDate);

  if (Number.isNaN(scheduledDate.getTime())) {
    throw new AppError("Invalid booking date", 400, "INVALID_BOOKING_DATE");
  }

  const startMinutes = minutesFromTime(bookingData.startTime);
  const endMinutes = minutesFromTime(bookingData.endTime);

  if (endMinutes <= startMinutes) {
    throw new AppError(
      "End time must be later than start time",
      400,
      "INVALID_BOOKING_TIME",
    );
  }

  const now = new Date();

  if (scheduledDate < new Date(now.toDateString())) {
    throw new AppError(
      "Booking date cannot be in the past",
      400,
      "BOOKING_DATE_IN_PAST",
    );
  }

  const dayName = getDayName(scheduledDate);
  const dayAvailability = provider.availability?.[dayName];

  if (!dayAvailability?.enabled) {
    throw new AppError(
      "Provider is not available on the selected day",
      409,
      "PROVIDER_UNAVAILABLE",
    );
  }

  const availableStart = minutesFromTime(dayAvailability.startTime);
  const availableEnd = minutesFromTime(dayAvailability.endTime);

  if (startMinutes < availableStart || endMinutes > availableEnd) {
    throw new AppError(
      "Selected time is outside the provider's working hours",
      409,
      "OUTSIDE_PROVIDER_HOURS",
    );
  }

  if (scheduledDate.toDateString() === now.toDateString()) {
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    if (startMinutes <= currentMinutes) {
      throw new AppError(
        "Booking start time must be in the future",
        400,
        "BOOKING_TIME_IN_PAST",
      );
    }
  }

  const dayStart = new Date(scheduledDate);
  dayStart.setHours(0, 0, 0, 0);

  const dayEnd = new Date(scheduledDate);
  dayEnd.setHours(23, 59, 59, 999);

  const existingBookings = await Booking.find({
    provider: provider._id,
    scheduledDate: { $gte: dayStart, $lte: dayEnd },
    status: { $in: ACTIVE_BOOKING_STATUSES },
  }).select("startTime endTime");

  const hasOverlap = existingBookings.some((existing) => {
    const existingStart = minutesFromTime(existing.startTime);
    const existingEnd = minutesFromTime(existing.endTime);

    return startMinutes < existingEnd && endMinutes > existingStart;
  });

  if (hasOverlap) {
    throw new AppError(
      "This time slot is already booked. Please choose another time",
      409,
      "BOOKING_TIME_CONFLICT",
    );
  }

  const quantity = bookingData.quantity || 1;
  const basePrice = providerService.price;
  const subtotal = basePrice * quantity;

  // Price is calculated on the server, never accepted from the client.
  const booking = await Booking.create({
    customer: customer._id,
    provider: provider._id,
    service: service._id,
    providerService: providerService._id,
    bookingNumber: generateBookingNumber(),
    status: BOOKING_STATUS.PENDING,
    scheduledDate,
    startTime: bookingData.startTime,
    endTime: bookingData.endTime,
    address: bookingData.address,
    customerNote: bookingData.customerNote || null,
    pricing: {
      basePrice,
      quantity,
      subtotal,
      discount: 0,
      platformFee: 0,
      tax: 0,
      totalAmount: subtotal,
      currency: "NPR",
    },
  });

  return Booking.findById(booking._id)
    .populate("customer", "firstName lastName phone")
    .populate("provider")
    .populate("service", "name slug")
    .populate("providerService");
};

module.exports = {
  createBooking,
};
