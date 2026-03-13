/**
 * @fileoverview Mongoose schema for mood tracking
 * @module models/moodTrackingModel
 */

const mongoose = require("mongoose");

const moodTrackingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Core Data
    moodType: {
      type: String,
      enum: [
        "HAPPY",
        "SAD",
        "ANXIOUS",
        "STRESSED",
        "ANGRY",
        "TIRED",
        "CALM",
        "EXCITED",
        "NEUTRAL",
      ],
      required: true,
    },

    moodIntensity: {
      type: Number,
      min: 1,
      max: 10,
      default: 5,
    },

    // ─────────────────────────────────────────────
    // NEW: Physical & Contextual Factors
    // ─────────────────────────────────────────────
    energyLevel: {
      type: Number, // 1 (drained) to 10 (high energy)
      min: 1,
      max: 10,
    },

    sleepHours: {
      type: Number,
      min: 0,
      max: 24,
    },

    weatherCondition: {
      type: String, // e.g., "Sunny", "Cloudy", "Rainy"
      default: null,
    },

    location: {
      type: String, // e.g., "Home", "Office", "Gym"
      trim: true,
    },

    // ─────────────────────────────────────────────
    // Enhanced Notes & Social
    // ─────────────────────────────────────────────
    moodNote: {
      type: String,
      trim: true,
      maxlength: 50, // Increased for better journaling
    },

    tags: [
      {
        type: String,
        trim: true,
      },
    ], // e.g., ["family", "deadline"]

    // Metadata
    moodDate: {
      type: Date,
      default: Date.now,
      index: true,
    },

    isPrivate: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// We keep the index for fast querying by date and user
moodTrackingSchema.index({ userId: 1, moodDate: -1 });

module.exports = mongoose.model("MoodTracking", moodTrackingSchema);
