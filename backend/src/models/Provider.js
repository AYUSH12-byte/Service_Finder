const mongoose = require("mongoose");

const PROVIDER_VERIFICATION_STATUS = {
  PENDING: "PENDING",
  VERIFIED: "VERIFIED",
  REJECTED: "REJECTED",
  SUSPENDED: "SUSPENDED",
};

const KYC_STATUS = {
  NOT_SUBMITTED: "NOT_SUBMITTED",
  PENDING: "PENDING",
  VERIFIED: "VERIFIED",
  REJECTED: "REJECTED",
};

const providerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Provider user is required"],
      unique: true,
      index: true,
    },

    businessName: {
      type: String,
      trim: true,
      maxlength: 150,
      default: null,
    },

    bio: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: null,
    },

    experienceYears: {
      type: Number,
      min: 0,
      max: 80,
      default: 0,
    },

    profileImage: {
      type: String,
      trim: true,
      default: null,
    },

    serviceAreas: [
      {
        type: String,
        trim: true,
        maxlength: 100,
      },
    ],

    availability: {
      monday: {
        enabled: { type: Boolean, default: true },
        startTime: { type: String, default: "09:00" },
        endTime: { type: String, default: "18:00" },
      },

      tuesday: {
        enabled: { type: Boolean, default: true },
        startTime: { type: String, default: "09:00" },
        endTime: { type: String, default: "18:00" },
      },

      wednesday: {
        enabled: { type: Boolean, default: true },
        startTime: { type: String, default: "09:00" },
        endTime: { type: String, default: "18:00" },
      },

      thursday: {
        enabled: { type: Boolean, default: true },
        startTime: { type: String, default: "09:00" },
        endTime: { type: String, default: "18:00" },
      },

      friday: {
        enabled: { type: Boolean, default: true },
        startTime: { type: String, default: "09:00" },
        endTime: { type: String, default: "18:00" },
      },

      saturday: {
        enabled: { type: Boolean, default: true },
        startTime: { type: String, default: "09:00" },
        endTime: { type: String, default: "18:00" },
      },

      sunday: {
        enabled: { type: Boolean, default: false },
        startTime: { type: String, default: "09:00" },
        endTime: { type: String, default: "18:00" },
      },
    },

    verificationStatus: {
      type: String,
      enum: Object.values(PROVIDER_VERIFICATION_STATUS),
      default: PROVIDER_VERIFICATION_STATUS.PENDING,
      index: true,
    },

    verificationReason: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: null,
    },

    verifiedAt: {
      type: Date,
      default: null,
    },

    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    kyc: {
      status: {
        type: String,
        enum: Object.values(KYC_STATUS),
        default: KYC_STATUS.NOT_SUBMITTED,
      },

      documentType: {
        type: String,
        enum: ["CITIZENSHIP", "PASSPORT", "DRIVING_LICENSE", "OTHER"],
        default: null,
      },

      documentUrl: {
        type: String,
        trim: true,
        default: null,
      },

      documentPublicId: {
        type: String,
        trim: true,
        default: null,
      },

      submittedAt: {
        type: Date,
        default: null,
      },

      reviewedAt: {
        type: Date,
        default: null,
      },

      reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },

      rejectionReason: {
        type: String,
        trim: true,
        maxlength: 1000,
        default: null,
      },
    },

    stats: {
      averageRating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
      },

      totalReviews: {
        type: Number,
        min: 0,
        default: 0,
      },

      completedJobs: {
        type: Number,
        min: 0,
        default: 0,
      },

      responseRate: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

providerSchema.index({
  verificationStatus: 1,
  "stats.averageRating": -1,
});

providerSchema.index({
  serviceAreas: 1,
});

module.exports = {
  Provider: mongoose.model("Provider", providerSchema),
  PROVIDER_VERIFICATION_STATUS,
  KYC_STATUS,
};
