const { User, USER_STATUS } = require("../models/User");
const AppError = require("../utils/AppError");
const { comparePassword } = require("../utils/password");
const { verifyRefreshToken, generateAccessToken, generateRefreshToken } = require("../utils/token");


const registerUser = async ({
  firstName,
  lastName,
  email,
  phone,
  password,
  role,
}) => {
  const existingEmail = await User.findOne({ email });

  if (existingEmail) {
    throw new AppError(
      "An account with this email already exists",
      409,
      "EMAIL_ALREADY_EXISTS",
    );
  }

  const existingPhone = await User.findOne({ phone });

  if (existingPhone) {
    throw new AppError(
      "An account with this phone number already exists",
      409,
      "PHONE_ALREADY_EXISTS",
    );
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    phone,
    password,
    role,
  });

  return user;
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");
  }

  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");
  }

  if (user.status === USER_STATUS.SUSPENDED) {
    throw new AppError(
      "Your account has been suspended",
      403,
      "ACCOUNT_SUSPENDED",
    );
  }

  if (user.status === USER_STATUS.INACTIVE) {
    throw new AppError("Your account is inactive", 403, "ACCOUNT_INACTIVE");
  }

  user.lastLoginAt = new Date();

  await user.save();

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return {
    user,
    accessToken,
    refreshToken,
  };
};

const refreshUserToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new AppError(
      "Refresh token is required",
      401,
      "REFRESH_TOKEN_REQUIRED",
    );
  }

  let decoded;

  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new AppError(
        "Refresh token has expired",
        401,
        "REFRESH_TOKEN_EXPIRED",
      );
    }

    throw new AppError("Invalid refresh token", 401, "INVALID_REFRESH_TOKEN");
  }

  if (decoded.type !== "refresh") {
    throw new AppError("Invalid refresh token", 401, "INVALID_REFRESH_TOKEN");
  }

  const user = await User.findById(decoded.sub);

  if (!user) {
    throw new AppError("User account no longer exists", 401, "USER_NOT_FOUND");
  }

  if (user.status !== USER_STATUS.ACTIVE) {
    throw new AppError("Your account is not active", 403, "ACCOUNT_NOT_ACTIVE");
  }

  if (decoded.tokenVersion !== user.refreshTokenVersion) {
    throw new AppError(
      "Refresh token has been revoked",
      401,
      "REFRESH_TOKEN_REVOKED",
    );
  }

  /*
   * Refresh-token rotation:
   * Every successful refresh invalidates the previous
   * token version and creates a new token pair.
   */
  user.refreshTokenVersion += 1;

  await user.save();

  const accessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);

  return {
    user,
    accessToken,
    refreshToken: newRefreshToken,
  };
};

const logoutUser = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User account not found", 404, "USER_NOT_FOUND");
  }

  user.refreshTokenVersion += 1;

  await user.save();
};

module.exports = {
  registerUser,
  loginUser,
  refreshUserToken,
  logoutUser,
};
