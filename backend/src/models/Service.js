const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Service category is required"],
      index: true,
    },

    name: {
      type: String,
      required: [true, "Service name is required"],
      trim: true,
      minlength: 2,
      maxlength: 150,
    },

    slug: {
      type: String,
      required: [true, "Service slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: null,
    },

    icon: {
      type: String,
      trim: true,
      maxlength: 100,
      default: null,
    },

    image: {
      type: String,
      trim: true,
      default: null,
    },

    basePrice: {
      type: Number,
      min: 0,
      default: 0,
    },

    priceType: {
      type: String,
      enum: ["FIXED", "HOURLY", "STARTING_FROM", "CUSTOM_QUOTE"],
      default: "CUSTOM_QUOTE",
      index: true,
    },

    estimatedDurationMinutes: {
      type: Number,
      min: 15,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    sortOrder: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

serviceSchema.index({
  name: "text",
  description: "text",
});

serviceSchema.index({
  category: 1,
  isActive: 1,
  sortOrder: 1,
});

module.exports = mongoose.model("Service", serviceSchema);
