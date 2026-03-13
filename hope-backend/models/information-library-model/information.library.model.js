/**
 * @fileoverview Mongoose schema for Mental Health Information Library
 * @module models/infoLibraryModel
 */

const mongoose = require("mongoose");
const { FLAT_CATEGORIES } = require("../../constants/categories.constants");

const infoLibrarySchema = new mongoose.Schema(
  {
    thumbnail: {
      type: [String],
    },

    title: {
      type: String,
      required: [true, "Please provide an article title"],
      trim: true,
      unique: true,
    },

    slug: {
      type: String,
      lowercase: true,
    },

    content: {
      type: String,
      required: [true, "Article content cannot be empty"],
    },

    category: {
      type: String,
      required: [true, "Please specify a category"],
      enum: {
        values: FLAT_CATEGORIES,
        message: "{VALUE} is not a supported category",
      },
      default: "STRESS",
    },

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    readingTime: {
      type: Number, // Estimated time in minutes
      default: 5,
    },

    isPublished: {
      type: Boolean,
      default: true,
    },

    viewCount: {
      type: Number,
      default: 0,
    },

    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SuperAdmin",
      required: [true, "Article must be attributed to a Super Admin"],
    },
  },
  {
    timestamps: true,
  },
);

// Middleware to automatically create a slug from the title before saving
infoLibrarySchema.pre("save", function () {
  if (this.isModified("title")) {
    this.slug = this.title
      .toLowerCase()
      .split(" ")
      .join("-")
      .replace(/[^\w-]+/g, "");
  }
});

module.exports = mongoose.model("InformationLibrary", infoLibrarySchema);
