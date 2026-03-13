/**
 * @fileoverview Mongoose schema for mood tracking
 * @module models/moodTrackingModel
 */

const mongoose = require("mongoose");

/**
 * Schema representing a user's daily mood entry
 */
const moodTrackingSchema = new mongoose.Schema(
  {
    // ─────────────────────────────────────────────
    // User Reference
    // ─────────────────────────────────────────────
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // ─────────────────────────────────────────────
    // Mood Type
    // ─────────────────────────────────────────────
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

    // ─────────────────────────────────────────────
    // Mood Intensity
    // Scale: 1 (very low) → 10 (very strong)
    // ─────────────────────────────────────────────
    moodIntensity: {
      type: Number,
      min: 1,
      max: 10,
      default: 5,
    },

    // ─────────────────────────────────────────────
    // Optional Mood Notes
    // ─────────────────────────────────────────────
    moodNote: {
      type: String,
      trim: true,
      maxlength: 500,
      default: null,
    },

    // ─────────────────────────────────────────────
    // Mood Tags (Triggers or Activities)
    // Example: ["work", "family", "exercise"]
    // ─────────────────────────────────────────────
    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    // ─────────────────────────────────────────────
    // Date of Mood Entry
    // ─────────────────────────────────────────────
    moodDate: {
      type: Date,
      default: Date.now,
      index: true,
    },

    // ─────────────────────────────────────────────
    // Privacy (Stealth Mode Support)
    // ─────────────────────────────────────────────
    isPrivate: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Prevent multiple mood entries in the same day for the same user
moodTrackingSchema.index({ userId: 1, moodDate: 1 });

module.exports = mongoose.model("MoodTracking", moodTrackingSchema);
