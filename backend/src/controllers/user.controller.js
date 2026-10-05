const asyncHandler = require("../utils/asyncHandler");
const { successResponse } = require("../utils/apiResponse");

const {
  getCurrentUser,
  updateCurrentUser,
  changePassword,
} = require("../services/user.service");

const formatUser = (user) => ({
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
  profileImage: user.profileImage,
  lastLoginAt: user.lastLoginAt,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const getMe = asyncHandler(async (req, res) => {
  const user = await getCurrentUser(req.user._id);

  return successResponse({
    res,
    message: "Profile retrieved successfully",
    data: {
      user: formatUser(user),
    },
  });
});

const updateMe = asyncHandler(async (req, res) => {
  const user = await updateCurrentUser(req.user._id, req.validated.body);

  return successResponse({
    res,
    message: "Profile updated successfully",
    data: {
      user: formatUser(user),
    },
  });
});

const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.validated.body;

  await changePassword(req.user._id, currentPassword, newPassword);

  return successResponse({
    res,
    message: "Password changed successfully. Please login again.",
  });
});

module.exports = {
  getMe,
  updateMe,
  updatePassword,
};
