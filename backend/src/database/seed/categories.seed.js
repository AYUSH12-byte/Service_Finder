const Category = require("../../models/Category");

const categories = [
  {
    name: "Home Services",
    slug: "home-services",
    description:
      "Professional services for home repair, maintenance, cleaning, and improvement.",
    icon: "home",
    sortOrder: 1,
  },

  {
    name: "Technology Services",
    slug: "technology-services",
    description:
      "Computer, mobile, networking, CCTV, and other technology services.",
    icon: "laptop",
    sortOrder: 2,
  },

  {
    name: "Automotive Services",
    slug: "automotive-services",
    description:
      "Professional repair, maintenance, washing, and roadside services for vehicles.",
    icon: "car",
    sortOrder: 3,
  },

  {
    name: "Personal Services",
    slug: "personal-services",
    description: "Personal care, beauty, photography, and lifestyle services.",
    icon: "user",
    sortOrder: 4,
  },

  {
    name: "Education Services",
    slug: "education-services",
    description: "Tutoring, training, and other educational services.",
    icon: "book",
    sortOrder: 5,
  },

  {
    name: "Event Services",
    slug: "event-services",
    description:
      "Professional services for weddings, parties, events, and special occasions.",
    icon: "calendar",
    sortOrder: 6,
  },
];

const seedCategories = async () => {
  const categoryMap = {};

  for (const categoryData of categories) {
    const category = await Category.findOneAndUpdate(
      {
        slug: categoryData.slug,
      },
      {
        $set: categoryData,
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      },
    );

    categoryMap[category.slug] = category._id;
  }

  console.log(`✅ ${categories.length} categories seeded`);

  return categoryMap;
};

module.exports = seedCategories;
