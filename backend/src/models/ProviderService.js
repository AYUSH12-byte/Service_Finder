const mongoose = require("mongoose");

const PROVIDER_PRICE_TYPES = {
  FIXED: "FIXED",
  HOURLY: "HOURLY",
  STARTING_FROM: "STARTING_FROM",
  CUSTOM_QUOTE: "CUSTOM_QUOTE",
};

const providerServiceSchema = new mongoose.Schema(
  {
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Provider",
      required: [true, "Provider is required"],
      index: true,
    },

    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: [true, "Service is required"],
      index: true,
    },

    price: {
      type: Number,
      min: 0,
      default: 0,
    },

    priceType: {
      type: String,
      enum: Object.values(PROVIDER_PRICE_TYPES),
      default: PROVIDER_PRICE_TYPES.CUSTOM_QUOTE,
    },

    experienceYears: {
      type: Number,
      min: 0,
      max: 80,
      default: 0,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

providerServiceSchema.index(
  {
    provider: 1,
    service: 1,
  },
  {
    unique: true,
  }
);

providerServiceSchema.index({
  service: 1,
  isActive: 1,
});

module.exports = {
  ProviderService: mongoose.model(
    "ProviderService",
    providerServiceSchema
  ),
  PROVIDER_PRICE_TYPES,
};