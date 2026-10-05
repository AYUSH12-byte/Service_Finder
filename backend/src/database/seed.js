require("dotenv").config();

const connectDB = require("../config/db");

const seedAdmin = require("./seed/admin.seed");
const seedCategories = require("./seed/categories.seed");
const seedServices = require("./seed/services.seed");

const runSeed = async () => {
  try {
    console.log("🌱 Starting Service Finder database seed...");

    await connectDB();

    await seedAdmin();

    await seedCategories();

    await seedServices();

    console.log("✅ Service Finder database seed completed successfully.");

    process.exit(0);
  } catch (error) {
    console.error("❌ Database seed failed:", error);

    process.exit(1);
  }
};

runSeed();
