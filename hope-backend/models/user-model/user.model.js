/**
 * @fileoverview Mongoose schema for application users
 * @module models/userModel
 */

const mongoose = require("mongoose");

/**
 * Schema for User
 * @typedef {Object} User
 * @property {string|null}   profilePicture      - URL to profile image
 * @property {string}        userName            - Display name
 * @property {string}        email               - Unique login email
 * @property {string}        password            - Hashed password
 * @property {number|null}   age                 - User's age
 * @property {string|null}   gender              - User's gender
 * @property {boolean}       isStealthModeEnabled - Privacy protection toggle
 * @property {string}        role                - USER or ADMIN
 */
const userSchema = new mongoose.Schema(
  {
    profilePicture: {
      type: String,
      default: null,
    },

    userName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    age: {
      type: Number,
      min: 10,
      max: 100,
      default: null,
    },

    gender: {
      type: String,
      enum: ["MALE", "FEMALE", "OTHER"],
      default: "MALE",
    },

    bio: {
      type: String,
      trim: true,
      default: null,
    },

    phone: {
      countryCode: { type: String, default: null },
      phoneNumber: { type: String, default: null },
    },

    // Stealth Mode (Privacy Protection requirement from FYP)
    isStealthModeEnabled: {
      type: Boolean,
      default: false,
    },

    role: {
      type: String,
      enum: ["USER"],
      default: "USER",
    },

    // Tracking progress (Functional Requirements: Mood Tracker & Habit Tracker)
    moodLogs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MoodLog",
      },
    ],

    habits: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Habit",
      },
    ],

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    emailVerificationToken: {
      type: String,
      default: null,
    },

    emailVerificationExpires: {
      type: Date,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastLogin: {
      type: Date,
      default: null,
    },

    loginAttempts: {
      type: Number,
      default: 0,
    },

    lockUntil: {
      type: Date,
      default: null,
    },

    sessionId: {
      type: String,
      default: null,
    },

    passwordResetToken: {
      type: String,
      default: null,
    },

    passwordResetExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual for full phone number calculation
userSchema.virtual("fullPhone").get(function () {
  if (!this.phone?.countryCode || !this.phone?.phoneNumber) return null;
  return `${this.phone.countryCode}${this.phone.phoneNumber}`.replace(
    /\s+/g,
    "",
  );
});

module.exports = mongoose.model("User", userSchema);
