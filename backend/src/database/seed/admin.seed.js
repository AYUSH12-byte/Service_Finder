const { User, USER_ROLES, USER_STATUS } = require("../../models/User");
const { hashPassword } = require("../../utils/password");

const seedAdmin = async () => {
  const email = process.env.SEED_ADMIN_EMAIL || "admin@servicefinder.local";

  const phone = process.env.SEED_ADMIN_PHONE || "9800000000";

  const password = process.env.SEED_ADMIN_PASSWORD || "Admin@12345";

  let admin = await User.findOne({
    email,
  });

  if (admin) {
    console.log("ℹ️ Admin already exists:", email);
    return admin;
  }

  const hashedPassword = await hashPassword(password);

  admin = await User.create({
    firstName: "Service",
    lastName: "Finder Admin",
    email,
    phone,
    password: hashedPassword,
    role: USER_ROLES.ADMIN,
    status: USER_STATUS.ACTIVE,
    emailVerified: true,
    phoneVerified: true,
  });

  console.log("✅ Development admin created:", email);

  return admin;
};

module.exports = seedAdmin;
