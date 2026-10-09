const asyncHandler = require("../utils/asyncHandler");
const { createdResponse } = require("../utils/apiResponse");
const { createBooking } = require("../services/booking.service");

const create = asyncHandler(async (req, res) => {
  const booking = await createBooking(
    req.user.id || req.user._id || req.user.sub,
    req.validated.body,
  );

  return createdResponse({
    res,
    message: "Booking request created successfully",
    data: { booking },
  });
});

module.exports = {
  create,
};
