const AppError = require("../utils/AppError");

const validate = (schema) => {
  return async (req, res, next) => {
    try {
      const result = await schema.safeParseAsync({
        body: req.body || {},
        params: req.params || {},
        query: req.query || {},
      });

      if (!result.success) {
        const errors = result.error.issues.map((issue) => ({
          field: issue.path.length
            ? issue.path.join(".")
            : "request",
          message: issue.message,
        }));

        return res.status(400).json({
          success: false,
          code: "VALIDATION_ERROR",
          message: "Request validation failed",
          errors,
        });
      }

      req.validated = result.data;

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = validate;