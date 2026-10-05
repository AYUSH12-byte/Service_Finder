const { User, USER_STATUS } = require("../models/User");
const AppError = require("../utils/AppError");
const { verifyAccessToken } = require("../utils/token");

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AppError(
        "Authentication required",
        401,
        "AUTHENTICATION_REQUIRED",
      );
    }

    if (!authHeader.startsWith("Bearer ")) {
      throw new AppError(
        "Invalid authorization format",
        401,
        "INVALID_AUTHORIZATION_HEADER",
      );
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      throw new AppError(
        "Access token is required",
        401,
        "ACCESS_TOKEN_REQUIRED",
      );
    }

    let decoded;

    try {
      decoded = verifyAccessToken(token);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw new AppError(
          "Access token has expired",
          401,
          "ACCESS_TOKEN_EXPIRED",
        );
      }

      throw new AppError("Invalid access token", 401, "INVALID_ACCESS_TOKEN");
    }

    if (decoded.type !== "access") {
      throw new AppError("Invalid access token", 401, "INVALID_ACCESS_TOKEN");
    }

    const user = await User.findById(decoded.sub);

    if (!user) {
      throw new AppError("User account not found", 401, "USER_NOT_FOUND");
    }

    if (user.status !== USER_STATUS.ACTIVE) {
      throw new AppError(
        "Your account is not active",
        403,
        "ACCOUNT_NOT_ACTIVE",
      );
    }

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(
        new AppError("Authentication required", 401, "AUTHENTICATION_REQUIRED"),
      );
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError(
          "You do not have permission to access this resource",
          403,
          "FORBIDDEN",
        ),
      );
    }

    next();
  };
};

module.exports = {
  authenticate,
  authorize,
};
