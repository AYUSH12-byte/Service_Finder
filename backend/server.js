require("dotenv").config();

const app = require("./src/app");

const PORT = process.env.PORT || 7000;

const startServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`🚀 Service Finder API running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();