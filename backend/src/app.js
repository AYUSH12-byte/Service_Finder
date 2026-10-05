const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");

const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const authRoutes = require("./routes/auth.routes");

const app = express();

// Security middleware
app.use(helmet());

// CORS
app.use(
  cors({
    origin:
      process.env.CLIENT_URL ||
      "http://localhost:5173",

    credentials: true,
  })
);

// Request parsing
app.use(
  express.json({
    limit: "10mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

app.use(cookieParser());

// Logging
if (
  process.env.NODE_ENV ===
  "development"
) {
  app.use(morgan("dev"));
}

// Rate limiting
const apiLimiter = rateLimit({
  windowMs:
    15 * 60 * 1000,

  max: 200,

  standardHeaders: true,

  legacyHeaders: false,

  message: {
    success: false,
    code:
      "RATE_LIMIT_EXCEEDED",
    message:
      "Too many requests. Please try again later.",
  },
});

app.use(
  "/api",
  apiLimiter
);

// Health check
app.get(
  "/api/health",
  (req, res) => {
    res.status(200).json({
      success: true,

      message:
        "Service Finder API is running",

      environment:
        process.env.NODE_ENV,

      timestamp:
        new Date().toISOString(),
    });
  }
);

// Routes
app.use("/api/v1/auth", authRoutes);

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

module.exports = app;