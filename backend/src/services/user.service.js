const { User } = require("../models/User");
const AppError = require("../utils/AppError");
const { comparePassword, hashPassword } = require("../utils/password");

const getCurrentUser = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User account not found", 404, "USER_NOT_FOUND");
  }

  return user;
};

const updateCurrentUser = async (userId, updateData) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User account not found", 404, "USER_NOT_FOUND");
  }

  if (updateData.phone) {
    const existingPhone = await User.findOne({
      phone: updateData.phone,
      _id: { $ne: userId },
    });

    if (existingPhone) {
      throw new AppError(
        "An account with this phone number already exists",
        409,
        "PHONE_ALREADY_EXISTS",
      );
    }
  }

  Object.assign(user, updateData);

  await user.save();

  return user;
};

const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select("+password");

  if (!user) {
    throw new AppError("User account not found", 404, "USER_NOT_FOUND");
  }

  const isCurrentPasswordValid = await comparePassword(
    currentPassword,
    user.password,
  );

  if (!isCurrentPasswordValid) {
    throw new AppError(
      "Current password is incorrect",
      401,
      "INVALID_CURRENT_PASSWORD",
    );
  }

  user.password = await hashPassword(newPassword);

  user.passwordChangedAt = new Date();

  /*
   * Revoke all refresh tokens after a password change.
   * This forces the user to authenticate again.
   */
  user.refreshTokenVersion += 1;

  await user.save();

  return user;
};

module.exports = {
  getCurrentUser,
  updateCurrentUser,
  changePassword,
};
