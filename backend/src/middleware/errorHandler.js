const mongoose = require("mongoose");

const errorHandler = (
  err,
  req,
  res,
  next
) => {
  let statusCode =
    err.statusCode || 500;

  let message =
    err.message ||
    "Internal server error";

  let code =
    err.code ||
    "INTERNAL_SERVER_ERROR";

  // Mongoose validation error
  if (
    err instanceof
    mongoose.Error.ValidationError
  ) {
    statusCode = 400;
    code = "VALIDATION_ERROR";

    const errors =
      Object.values(
        err.errors
      ).map((error) => ({
        field: error.path,
        message:
          error.message,
      }));

    return res
      .status(statusCode)
      .json({
        success: false,
        code,
        message:
          "Validation failed",
        errors,
      });
  }

  // Mongoose cast error
  if (
    err instanceof
    mongoose.Error.CastError
  ) {
    statusCode = 400;
    code = "INVALID_ID";

    message = `Invalid value for ${err.path}`;
  }

  // MongoDB duplicate key error
  if (err.code === 11000) {
    statusCode = 409;
    code =
      "DUPLICATE_RESOURCE";

    const fields =
      Object.keys(
        err.keyPattern || {}
      );

    message = fields.length
      ? `${fields.join(
          ", "
        )} already exists`
      : "A resource with the same value already exists";
  }

  // JWT errors
  if (
    err.name ===
    "JsonWebTokenError"
  ) {
    statusCode = 401;
    code = "INVALID_TOKEN";

    message =
      "Invalid authentication token";
  }

  if (
    err.name ===
    "TokenExpiredError"
  ) {
    statusCode = 401;
    code = "TOKEN_EXPIRED";

    message =
      "Authentication token has expired";
  }

  // Production error response
  const response = {
    success: false,
    code,
    message,
  };

  // Include detailed error information during development
  if (
    process.env.NODE_ENV ===
    "development"
  ) {
    response.stack =
      err.stack;
  }

  console.error(
    "❌ API Error:",
    {
      method:
        req.method,

      url:
        req.originalUrl,

      statusCode,

      code,

      message,
    }
  );

  res
    .status(statusCode)
    .json(response);
};

module.exports = errorHandler;