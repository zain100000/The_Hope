/**
 * @fileoverview Express routes for Mood Tracker
 * @module routes/moodTrackerRoutes
 */

const express = require("express");
const router = express.Router();

const moodController = require("../../controllers/mood-tracker-controller/mood.tracker.controller");
const {
  encryptedAuthMiddleware,
} = require("../../middlewares/auth-middleware/auth.middleware");

/**
 * @description Register new mood
 * @route   POST /api/mood/create-mood
 * @access  Public (should be restricted in production)
 */
router.post(
  "/create-mood",
  encryptedAuthMiddleware,
  moodController.createMoodEntry,
);

/**
 * @description Get User Mood Entries
 * @route   GET /api/mood/get-user-mood
 * @access  Private (User)
 */
router.get(
  "/get-user-moods",
  encryptedAuthMiddleware,
  moodController.getUserMoods,
);

/**
 * @description Update User Mood Entry
 * @route   PATCH /api/mood/update-user-mood/:moodId
 * @access  Private (User)
 */
router.patch(
  "/update-user-mood/:moodId",
  encryptedAuthMiddleware,
  moodController.updateMoodEntry,
);

/**
 * @description Delete User Mood Entry
 * @route   PATCH /api/mood/delete-user-mood/:moodId
 * @access  Private (User)
 */
router.delete(
  "/delete-mood/:moodId",
  encryptedAuthMiddleware,
  moodController.deleteMoodEntry,
);

/**
 * @description Get User Mood Analytics
 * @route   GET /api/mood/get-mood-analytics
 * @access  Private (User)
 */
router.get(
  "/get-mood-analytics",
  encryptedAuthMiddleware,
  moodController.getMoodAnalytics,
);

module.exports = router;
