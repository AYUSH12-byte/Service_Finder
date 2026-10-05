const Service = require("../../models/Service");
const Category = require("../../models/Category");

const services = [
  /*
   * HOME SERVICES
   */
  {
    categorySlug: "home-services",
    name: "Plumbing Repair",
    slug: "plumbing-repair",
    description:
      "Repair and maintenance of water pipes, taps, sinks, toilets, and plumbing systems.",
    icon: "wrench",
    basePrice: 500,
    priceType: "STARTING_FROM",
    estimatedDurationMinutes: 120,
    sortOrder: 1,
  },

  {
    categorySlug: "home-services",
    name: "Electrical Repair",
    slug: "electrical-repair",
    description: "Professional electrical repair and installation services.",
    icon: "zap",
    basePrice: 500,
    priceType: "STARTING_FROM",
    estimatedDurationMinutes: 120,
    sortOrder: 2,
  },

  {
    categorySlug: "home-services",
    name: "Carpentry",
    slug: "carpentry",
    description:
      "Furniture repair, woodwork, doors, cabinets, and other carpentry services.",
    icon: "hammer",
    basePrice: 800,
    priceType: "STARTING_FROM",
    estimatedDurationMinutes: 180,
    sortOrder: 3,
  },

  {
    categorySlug: "home-services",
    name: "House Cleaning",
    slug: "house-cleaning",
    description: "Professional residential cleaning services.",
    icon: "sparkles",
    basePrice: 1000,
    priceType: "STARTING_FROM",
    estimatedDurationMinutes: 180,
    sortOrder: 4,
  },

  {
    categorySlug: "home-services",
    name: "Painting",
    slug: "house-painting",
    description: "Interior and exterior house painting services.",
    icon: "paintbrush",
    basePrice: 0,
    priceType: "CUSTOM_QUOTE",
    estimatedDurationMinutes: 480,
    sortOrder: 5,
  },

  {
    categorySlug: "home-services",
    name: "AC Repair",
    slug: "ac-repair",
    description: "Air conditioner inspection, servicing, and repair.",
    icon: "snowflake",
    basePrice: 800,
    priceType: "STARTING_FROM",
    estimatedDurationMinutes: 120,
    sortOrder: 6,
  },

  {
    categorySlug: "home-services",
    name: "Refrigerator Repair",
    slug: "refrigerator-repair",
    description: "Professional refrigerator diagnosis and repair.",
    icon: "box",
    basePrice: 700,
    priceType: "STARTING_FROM",
    estimatedDurationMinutes: 120,
    sortOrder: 7,
  },

  {
    categorySlug: "home-services",
    name: "Washing Machine Repair",
    slug: "washing-machine-repair",
    description: "Washing machine inspection, servicing, and repair.",
    icon: "washing-machine",
    basePrice: 700,
    priceType: "STARTING_FROM",
    estimatedDurationMinutes: 120,
    sortOrder: 8,
  },

  /*
   * TECHNOLOGY SERVICES
   */
  {
    categorySlug: "technology-services",
    name: "Computer Repair",
    slug: "computer-repair",
    description: "Laptop and desktop troubleshooting, repair, and maintenance.",
    icon: "monitor",
    basePrice: 500,
    priceType: "STARTING_FROM",
    estimatedDurationMinutes: 120,
    sortOrder: 1,
  },

  {
    categorySlug: "technology-services",
    name: "Mobile Phone Repair",
    slug: "mobile-phone-repair",
    description:
      "Smartphone diagnosis, software troubleshooting, and hardware repair.",
    icon: "smartphone",
    basePrice: 500,
    priceType: "STARTING_FROM",
    estimatedDurationMinutes: 120,
    sortOrder: 2,
  },

  {
    categorySlug: "technology-services",
    name: "CCTV Installation",
    slug: "cctv-installation",
    description: "CCTV camera installation, configuration, and maintenance.",
    icon: "camera",
    basePrice: 1500,
    priceType: "STARTING_FROM",
    estimatedDurationMinutes: 240,
    sortOrder: 3,
  },

  {
    categorySlug: "technology-services",
    name: "Networking Setup",
    slug: "networking-setup",
    description: "Wi-Fi, router, LAN, and small-office networking setup.",
    icon: "wifi",
    basePrice: 1000,
    priceType: "STARTING_FROM",
    estimatedDurationMinutes: 180,
    sortOrder: 4,
  },

  {
    categorySlug: "technology-services",
    name: "Software Installation",
    slug: "software-installation",
    description: "Operating system, driver, and application installation.",
    icon: "download",
    basePrice: 500,
    priceType: "FIXED",
    estimatedDurationMinutes: 60,
    sortOrder: 5,
  },

  /*
   * AUTOMOTIVE SERVICES
   */
  {
    categorySlug: "automotive-services",
    name: "Bike Repair",
    slug: "bike-repair",
    description: "Motorcycle inspection, repair, and maintenance.",
    icon: "bike",
    basePrice: 500,
    priceType: "STARTING_FROM",
    estimatedDurationMinutes: 120,
    sortOrder: 1,
  },

  {
    categorySlug: "automotive-services",
    name: "Car Repair",
    slug: "car-repair",
    description: "Car inspection, maintenance, and mechanical repair.",
    icon: "car",
    basePrice: 1000,
    priceType: "STARTING_FROM",
    estimatedDurationMinutes: 180,
    sortOrder: 2,
  },

  {
    categorySlug: "automotive-services",
    name: "Car Wash",
    slug: "car-wash",
    description: "Professional exterior and interior vehicle cleaning.",
    icon: "droplets",
    basePrice: 500,
    priceType: "FIXED",
    estimatedDurationMinutes: 90,
    sortOrder: 3,
  },

  {
    categorySlug: "automotive-services",
    name: "Bike Wash",
    slug: "bike-wash",
    description: "Professional motorcycle cleaning and washing.",
    icon: "droplets",
    basePrice: 250,
    priceType: "FIXED",
    estimatedDurationMinutes: 45,
    sortOrder: 4,
  },

  /*
   * PERSONAL SERVICES
   */
  {
    categorySlug: "personal-services",
    name: "Barber Service",
    slug: "barber-service",
    description: "Professional haircut and grooming services.",
    icon: "scissors",
    basePrice: 300,
    priceType: "STARTING_FROM",
    estimatedDurationMinutes: 60,
    sortOrder: 1,
  },

  {
    categorySlug: "personal-services",
    name: "Makeup Artist",
    slug: "makeup-artist",
    description:
      "Professional makeup services for events and special occasions.",
    icon: "sparkles",
    basePrice: 1500,
    priceType: "STARTING_FROM",
    estimatedDurationMinutes: 120,
    sortOrder: 2,
  },

  {
    categorySlug: "personal-services",
    name: "Photography",
    slug: "photography",
    description: "Professional photography for events and personal occasions.",
    icon: "camera",
    basePrice: 3000,
    priceType: "STARTING_FROM",
    estimatedDurationMinutes: 180,
    sortOrder: 3,
  },

  /*
   * EDUCATION
   */
  {
    categorySlug: "education-services",
    name: "Home Tutor",
    slug: "home-tutor",
    description: "One-to-one tutoring for school and college students.",
    icon: "book-open",
    basePrice: 500,
    priceType: "HOURLY",
    estimatedDurationMinutes: 60,
    sortOrder: 1,
  },

  {
    categorySlug: "education-services",
    name: "Computer Training",
    slug: "computer-training",
    description: "Individual computer and technology training.",
    icon: "monitor",
    basePrice: 500,
    priceType: "HOURLY",
    estimatedDurationMinutes: 60,
    sortOrder: 2,
  },

  /*
   * EVENT SERVICES
   */
  {
    categorySlug: "event-services",
    name: "Event Photography",
    slug: "event-photography",
    description: "Professional photography for weddings, parties, and events.",
    icon: "camera",
    basePrice: 5000,
    priceType: "STARTING_FROM",
    estimatedDurationMinutes: 240,
    sortOrder: 1,
  },

  {
    categorySlug: "event-services",
    name: "Event Decoration",
    slug: "event-decoration",
    description:
      "Decoration and setup services for parties and special events.",
    icon: "party-popper",
    basePrice: 5000,
    priceType: "CUSTOM_QUOTE",
    estimatedDurationMinutes: 240,
    sortOrder: 2,
  },
];

const seedServices = async () => {
  let count = 0;

  for (const serviceData of services) {
    const { categorySlug, ...data } = serviceData;

    const category = await Category.findOne({
      slug: categorySlug,
    });

    if (!category) {
      console.warn(`⚠️ Category not found for ${data.name}: ${categorySlug}`);

      continue;
    }

    await Service.findOneAndUpdate(
      {
        slug: data.slug,
      },
      {
        $set: {
          ...data,
          category: category._id,
        },
      },
      {
        upsert: true,
        returnDocument: "after",
        setDefaultsOnInsert: true,
      },
    );

    count++;
  }

  console.log(`✅ ${count} services seeded`);
};

module.exports = seedServices;
