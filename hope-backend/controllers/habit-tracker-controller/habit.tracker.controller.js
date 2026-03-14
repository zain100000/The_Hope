/**
 * @fileoverview Robust controller for Self-Care Habit Tracker
 * @module controllers/habitController
 */

const Habit = require("../../models/habit-tracker-model/habit.tracker.model");
const User = require("../../models/user-model/user.model");
const moment = require("moment"); // Highly recommended for date handling

/**
 * Create a new personal habit
 * @access Private (User)
 */
exports.createHabit = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      frequency,
      isReminderOn,
      reminderTime,
    } = req.body;

    /* 1. VALIDATION */
    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Habit title is required",
      });
    }

    /* 2. CREATE HABIT */
    const habit = new Habit({
      user: req.user.id,
      title,
      description,
      category,
      frequency,
      isReminderOn,
      reminderTime,
    });

    await habit.save();

    /* 3. SYNC WITH USER SCHEMA */
    // We update the User document to include this new habit ID in their 'habits' array
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $push: { habits: habit._id } },
      { new: true },
    );

    if (!updatedUser) {
      // If for some reason the user isn't found, we should clean up the orphaned habit
      await Habit.findByIdAndDelete(habit._id);
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(201).json({
      success: true,
      message: "Habit created successfully",
      habit,
    });
  } catch (error) {
    console.error("Create Habit Sync Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create habit",
      error: error.message,
    });
  }
};

/**
 * Get all habits for the logged-in user
 * @access Private (User)
 */
exports.getMyHabits = async (req, res) => {
  try {
    const userId = req.user.id;
    const { category, isActive } = req.query;

    // 1. Build a dynamic query object
    let query = { user: userId };

    // Filter by Category if provided (e.g., /?category=HYDRATION)
    if (category) {
      query.category = category.toUpperCase();
    }

    // Filter by Active status if provided (e.g., /?isActive=true)
    if (isActive !== undefined) {
      query.isActive = isActive === "true";
    }

    // 2. Fetch habits from the Habit collection
    // We sort by createdAt: -1 so the most recently created habits appear at the top
    const habits = await Habit.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Habits fetched successfully",
      count: habits.length,
      allHabits: habits,
    });
  } catch (error) {
    console.error("Get Habits Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve habits",
      error: error.message,
    });
  }
};

/**
 * Toggle Habit Completion for Today
 * This is the engine for your Progress Bar
 * @access Private (User)
 */
exports.toggleHabitCompletion = async (req, res) => {
  try {
    const { habitId } = req.params;
    // We use YYYY-MM-DD to ensure consistency regardless of time of day
    const today = moment().format("YYYY-MM-DD");
    const yesterday = moment().subtract(1, "days").format("YYYY-MM-DD");

    const habit = await Habit.findOne({ _id: habitId, user: req.user.id });

    if (!habit) {
      return res
        .status(404)
        .json({ success: false, message: "Habit not found" });
    }

    const isDoneToday = habit.completedDates.includes(today);

    if (isDoneToday) {
      // 1. If already done, "Undo" it (Remove today's date)
      habit.completedDates = habit.completedDates.filter(
        (date) => date !== today,
      );

      // Recalculate streak (Simplistic version: decrement)
      if (habit.currentStreak > 0) habit.currentStreak -= 1;
    } else {
      // 2. Mark as Done (Add today's date)
      habit.completedDates.push(today);

      // 3. Update Streak Logic
      const wasDoneYesterday = habit.completedDates.includes(yesterday);
      if (wasDoneYesterday || habit.completedDates.length === 1) {
        habit.currentStreak += 1;
      } else {
        habit.currentStreak = 1; // Reset streak if they missed a day
      }

      // 4. Update Longest Streak
      if (habit.currentStreak > habit.longestStreak) {
        habit.longestStreak = habit.currentStreak;
      }
    }

    await habit.save();

    res.status(200).json({
      success: true,
      message: isDoneToday
        ? "Habit marked as incomplete"
        : "Habit completed! Streak updated.",
      currentStreak: habit.currentStreak,
      isCompletedToday: !isDoneToday,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error updating completion status" });
  }
};

/**
 * Get Dashboard for any selected date (Past or Today)
 * Directly drives the "Horizontal Calendar" and "Progress Bar" UI
 */
exports.getDailyDashboard = async (req, res) => {
  try {
    // 1. Get the date from query (e.g., /?date=2026-02-05) or default to today
    const targetDate = req.query.date || moment().format("YYYY-MM-DD");
    const dayName = moment(targetDate).format("dddd").toUpperCase(); // e.g., "THURSDAY"

    // 2. Security Check: Prevent future completion logic (but allow viewing)
    const isFuture = moment(targetDate).isAfter(moment(), "day");

    // 3. Find habits scheduled for this specific day of the week
    const habits = await Habit.find({
      user: req.user.id,
      isActive: true,
      frequency: dayName,
      // Only show habits that existed on or before the target date
      createdAt: { $lte: moment(targetDate).endOf("day").toDate() },
    }).sort({ createdAt: 1 });

    // 4. Map habits to include a "isCompleted" boolean for the checkbox
    const formattedHabits = habits.map((habit) => {
      const habitObj = habit.toObject();
      return {
        ...habitObj,
        isCompleted: habit.completedDates.includes(targetDate),
      };
    });

    // 5. Calculate Progress Stats
    const total = habits.length;
    const completedCount = formattedHabits.filter((h) => h.isCompleted).length;
    const progressPercent =
      total > 0 ? Math.round((completedCount / total) * 100) : 0;

    res.status(200).json({
      success: true,
      message: "Daily dashboard loaded successfully",
      selectedDate: targetDate,
      dayOfWeek: dayName,
      isFuture,
      stats: {
        total,
        completed: completedCount,
        percent: progressPercent,
        label: `${completedCount} of ${total} completed`, // Matches your UI text
      },
      habits: formattedHabits,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error loading dashboard" });
  }
};

/**
 * Delete Habit and remove reference from User profile
 * @access Private (User)
 */
exports.deleteHabit = async (req, res) => {
  try {
    const { habitId } = req.params;
    const userId = req.user.id;

    // 1. Delete the habit document
    // We check both _id and user to ensure a user can't delete someone else's habit
    const deletedHabit = await Habit.findOneAndDelete({
      _id: habitId,
      user: userId,
    });

    if (!deletedHabit) {
      return res.status(404).json({
        success: false,
        message: "Habit not found or you do not have permission to delete it.",
      });
    }

    // 2. SYNC: Remove the Habit ID from the User's habits array
    await User.findByIdAndUpdate(
      userId,
      { $pull: { habits: habitId } }, // $pull removes all instances of the ID from the array
    );

    res.status(200).json({
      success: true,
      message: "Habit deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Habit Error:", error);
    res.status(500).json({
      success: false,
      message: "Delete operation failed",
      error: error.message,
    });
  }
};
