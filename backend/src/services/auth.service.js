const { User } = require("../models/User");
const { hashPassword } = require("../utils/password");
const AppError = require("../utils/AppError");

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
      "EMAIL_ALREADY_EXISTS"
    );
  }

  const existingPhone = await User.findOne({ phone });

  if (existingPhone) {
    throw new AppError(
      "An account with this phone number already exists",
      409,
      "PHONE_ALREADY_EXISTS"
    );
  }

  const hashedPassword = await hashPassword(password);

  const user = await User.create({
    firstName,
    lastName,
    email,
    phone,
    password: hashedPassword,
    role,
  });

  return user;
};

module.exports = {
  registerUser,
};