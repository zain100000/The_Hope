/**
 * @fileoverview Express routes for Habit Tracker
 * @module routes/habitRoutes
 */

const express = require("express");
const router = express.Router();
const habitController = require("../../controllers/habit-tracker-controller/habit.tracker.controller");
const {
  encryptedAuthMiddleware,
} = require("../../middlewares/auth-middleware/auth.middleware");

/**
 * @description Create new habit
 * @route   POST /api/habit/create-habit
 * @access  Public (User)
 */
router.post(
  "/create-habit",
  encryptedAuthMiddleware,
  habitController.createHabit,
);

/**
 * @description Get all user habits
 * @route   GET /api/habit/get-user-habits
 * @access  Private (User)
 */
router.get(
  "/get-user-habits",
  encryptedAuthMiddleware,
  habitController.getMyHabits,
);

/**
 * @route   PATCH /api/habit/toggle-status/:habitId
 * @desc    Toggle completion for today and update streaks
 * @access  Private (User)
 */
router.patch(
  "/toggle-habit-status/:habitId",
  encryptedAuthMiddleware,
  habitController.toggleHabitCompletion,
);

/**
 * @route   GET /api/habit/get-daily-dashboard
 * @desc    Get stats and habits scheduled for the current day
 * @access  Private (User)
 */
router.get(
  "/get-daily-dashboard",
  encryptedAuthMiddleware,
  habitController.getDailyDashboard,
);

/**
 * @description Delete habit
 * @route   DELETE /api/habit/delete-habit/:habitId
 * @access  Private (User)
 */
router.delete(
  "/delete-habit/:habitId",
  encryptedAuthMiddleware,
  habitController.deleteHabit,
);

module.exports = router;
