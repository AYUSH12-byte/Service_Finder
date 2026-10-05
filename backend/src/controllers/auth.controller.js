const asyncHandler = require("../utils/asyncHandler");
const { createdResponse } = require("../utils/apiResponse");
const { registerUser } = require("../services/auth.service");

const register = asyncHandler(async (req, res) => {
  const user = await registerUser(req.validated.body);

  return createdResponse({
    res,
    message: "Account registered successfully",
    data: {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        emailVerified: user.emailVerified,
        phoneVerified: user.phoneVerified,
        createdAt: user.createdAt,
      },
    },
  });
});

module.exports = {
  register,
};
