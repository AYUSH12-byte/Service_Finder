const asyncHandler = require("../utils/asyncHandler");
const { successResponse } = require("../utils/apiResponse");

const {
  initiatePayment,
  confirmCashPayment,
  getPaymentDetails,
} = require("../services/payment.service");

const initiate = asyncHandler(async (req, res) => {
  const booking = await initiatePayment(
    req.user,
    req.validated.params.id,
    req.validated.body.method,
  );

  return successResponse({
    res,
    message: "Cash payment initiated successfully.",
    data: {
      bookingId: booking._id,
      bookingNumber: booking.bookingNumber,
      bookingStatus: booking.status,
      amount: booking.pricing?.totalAmount,
      currency: booking.pricing?.currency || "NPR",
      payment: booking.payment,
    },
  });
});

const confirmCash = asyncHandler(async (req, res) => {
  const booking = await confirmCashPayment(req.user, req.validated.params.id);

  return successResponse({
    res,
    message: "Cash payment confirmed successfully.",
    data: {
      bookingId: booking._id,
      bookingNumber: booking.bookingNumber,
      bookingStatus: booking.status,
      payment: booking.payment,
    },
  });
});

const getDetails = asyncHandler(async (req, res) => {
  const payment = await getPaymentDetails(req.user, req.validated.params.id);

  return successResponse({
    res,
    message: "Payment details retrieved successfully.",
    data: { payment },
  });
});

module.exports = {
  initiate,
  confirmCash,
  getDetails,
};
