const asyncHandler = require("../utils/asyncHandler");
const { createdResponse, successResponse } = require("../utils/apiResponse");

const { registerUser, loginUser } = require("../services/auth.service");

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

const login = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await loginUser(
    req.validated.body,
  );

  return successResponse({
    res,
    message: "Login successful",
    data: {
      accessToken,

      refreshToken,

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
        lastLoginAt: user.lastLoginAt,
      },
    },
  });
});

module.exports = {
  register,
  login,
};
