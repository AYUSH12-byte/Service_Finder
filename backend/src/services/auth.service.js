const { User, USER_STATUS } = require("../models/User");
const AppError = require("../utils/AppError");
const { comparePassword } = require("../utils/password");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");

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

module.exports = {
  registerUser,
  loginUser,
};
