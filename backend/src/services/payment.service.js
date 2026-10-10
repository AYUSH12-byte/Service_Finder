
const mongoose = require("mongoose");

const { Booking, BOOKING_STATUS, PAYMENT_STATUS } =
  require("../models/Booking");
const { Provider } = require("../models/Provider");
const AppError = require("../utils/AppError");

function getUserId(user) {
  const id = user?.id || user?._id || user?.sub;

  if (!id || !mongoose.isValidObjectId(id)) {
    throw new AppError("Invalid authenticated user.", 401);
  }

  return id;
}

async function getCustomerBooking(customerId, bookingId) {
  const booking = await Booking.findOne({
    _id: bookingId,
    customer: customerId,
  });

  if (!booking) {
    throw new AppError("Booking not found.", 404);
  }

  return booking;
}

async function initiatePayment(user, bookingId, method) {
  const customerId = getUserId(user);

  const booking = await getCustomerBooking(customerId, bookingId);

  if (
    ![
      BOOKING_STATUS.COMPLETED,
      BOOKING_STATUS.PAYMENT_PENDING,
    ].includes(booking.status)
  ) {
    throw new AppError(
      "Payment can only be initiated for a completed booking.",
      409
    );
  }

  if (
    booking.status === BOOKING_STATUS.PAID ||
    booking.payment?.status === PAYMENT_STATUS.PAID
  ) {
    throw new AppError("This booking has already been paid.", 409);
  }

  // Never create a fake online payment success.
  // Gateway integration will be added in a later step.
  if (method !== "CASH") {
    throw new AppError(
      `${method} payment is not configured yet. Use CASH for now.`,
      501,
      "PAYMENT_GATEWAY_NOT_CONFIGURED"
    );
  }

  if (
    booking.payment?.method &&
    booking.payment.method !== "CASH" &&
    booking.payment.status === PAYMENT_STATUS.PROCESSING
  ) {
    throw new AppError(
      "Another payment attempt is already processing.",
      409
    );
  }

  const updatedBooking = await Booking.findOneAndUpdate(
    {
      _id: booking._id,
      customer: customerId,
      status: {
        $in: [
          BOOKING_STATUS.COMPLETED,
          BOOKING_STATUS.PAYMENT_PENDING,
        ],
      },
      "payment.status": { $ne: PAYMENT_STATUS.PAID },
    },
    {
      $set: {
        status: BOOKING_STATUS.PAYMENT_PENDING,
        "payment.status": PAYMENT_STATUS.PENDING,
        "payment.method": "CASH",
      },
    },
    {
      returnDocument: "after",
      runValidators: true,
    }
  );

  if (!updatedBooking) {
    throw new AppError(
      "Booking payment could not be started. Refresh and try again.",
      409
    );
  }

  return updatedBooking;
}

async function confirmCashPayment(user, bookingId) {
  const providerUserId = getUserId(user);

  const provider = await Provider.findOne({
    user: providerUserId,
  }).select("_id");

  if (!provider) {
    throw new AppError("Provider profile not found.", 404);
  }

  const booking = await Booking.findOne({
    _id: bookingId,
    provider: provider._id,
  });

  if (!booking) {
    throw new AppError("Booking not found.", 404);
  }

  if (booking.status !== BOOKING_STATUS.PAYMENT_PENDING) {
    throw new AppError(
      "This booking is not awaiting payment confirmation.",
      409
    );
  }

  if (booking.payment?.method !== "CASH") {
    throw new AppError(
      "Only cash payments can be confirmed through this endpoint.",
      409
    );
  }

  if (booking.payment?.status === PAYMENT_STATUS.PAID) {
    throw new AppError("This booking has already been paid.", 409);
  }

  const updatedBooking = await Booking.findOneAndUpdate(
    {
      _id: booking._id,
      provider: provider._id,
      status: BOOKING_STATUS.PAYMENT_PENDING,
      "payment.method": "CASH",
      "payment.status": PAYMENT_STATUS.PENDING,
    },
    {
      $set: {
        status: BOOKING_STATUS.PAID,
        "payment.status": PAYMENT_STATUS.PAID,
        "payment.paidAt": new Date(),
      },
    },
    {
      returnDocument: "after",
      runValidators: true,
    }
  );

  if (!updatedBooking) {
    throw new AppError(
      "Payment status changed or was already confirmed.",
      409
    );
  }

  return updatedBooking;
}

async function getPaymentDetails(user, bookingId) {
  const userId = getUserId(user);

  const booking = await Booking.findById(bookingId)
    .select(
      "customer provider bookingNumber status pricing payment createdAt updatedAt"
    )
    .populate({
      path: "provider",
      select: "user",
    });

  if (!booking) {
    throw new AppError("Booking not found.", 404);
  }

  const isCustomer =
    String(booking.customer) === String(userId);

  const isProvider =
    booking.provider?.user &&
    String(booking.provider.user) === String(userId);

  if (!isCustomer && !isProvider) {
    throw new AppError(
      "You are not authorized to view this payment.",
      403
    );
  }

  return {
    bookingNumber: booking.bookingNumber,
    bookingStatus: booking.status,
    amount: booking.pricing?.totalAmount,
    currency: booking.pricing?.currency || "NPR",
    payment: booking.payment,
  };
}

module.exports = {
  initiatePayment,
  confirmCashPayment,
  getPaymentDetails,
};
