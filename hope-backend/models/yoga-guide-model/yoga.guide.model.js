/**
 * @fileoverview Mongoose schema for Yoga Guides
 * @module models/yogaGuideModel
 */

const mongoose = require("mongoose");

// ─── SUB-SCHEMA: INSTRUCTIONS / STEPS ──────────────────────────────────────
const instructionSchema = new mongoose.Schema(
  {
    stepNumber: {
      type: Number,
      required: true,
    },

    text: {
      type: String,
      required: [true, "Step instruction text is required"],
      trim: true,
    },

    stepImageUrl: {
      type: String,
      default: null, // Optional step-specific image
    },
  },
  { _id: false },
);

// ─── MAIN SCHEMA: YOGA GUIDE ───────────────────────────────────────────────
const yogaGuideSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Yoga pose title is required"],
      trim: true,
      maxlength: [50, "Title is too long"],
    },

    description: {
      type: String,
      required: [true, "Please provide a short description"],
      maxlength: [100, "Description is too long"],
      trim: true,
    },

    // ─── YOGA STYLE ───────────────────────────────────────────────────────
    category: {
      type: String,
      enum: [
        "HATHA",
        "VINYASA",
        "ASHTANGA",
        "YIN",
        "RESTORATIVE",
        "POWER",
        "KUNDALINI",
        "CHAIR_YOGA",
        "PRENATAL",
      ],
      required: true,
    },

    difficultyLevel: {
      type: String,
      enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED"],
      default: "BEGINNER",
    },

    durationMinutes: {
      type: Number,
      required: [true, "Estimated duration is required"],
      min: [1, "Duration must be at least 1 minute"],
    },

    // ─── BENEFITS ─────────────────────────────────────────────────────────
    benefits: [
      {
        type: String,
        trim: true,
      },
    ],

    // e.g., Hamstrings, Spine, Shoulders
    targetAreas: [
      {
        type: String,
        trim: true,
      },
    ],

    equipmentNeeded: [
      {
        type: String,
        default: "None",
      },
    ],

    // ─── MEDIA ────────────────────────────────────────────────────────────
    coverImage: {
      type: String,
      required: [true, "A cover image URL is required"],
    },

    video: {
      type: String,
      default: null,
    },

    instructions: [instructionSchema],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// ─── INDEX FOR FAST FILTERING ─────────────────────────────────────────────
yogaGuideSchema.index({ category: 1, difficultyLevel: 1, isActive: 1 });

module.exports = mongoose.model("YogaGuide", yogaGuideSchema);
