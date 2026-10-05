const jwt = require("jsonwebtoken");

const AUTH_CONFIG = require("../config/auth");

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      sub: user._id.toString(),
      role: user.role,
      type: "access",
    },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: AUTH_CONFIG.ACCESS_TOKEN_EXPIRES_IN,
    },
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      sub: user._id.toString(),
      tokenVersion: user.refreshTokenVersion,
      type: "refresh",
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: AUTH_CONFIG.REFRESH_TOKEN_EXPIRES_IN,
    },
  );
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
