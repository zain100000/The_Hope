/**
 * @fileoverview Express routes for Yoga Guide CRUD operations
 * @module routes/yogaGuideRoutes
 */

const express = require("express");
const router = express.Router();

const yogaGuideController = require("../../controllers/yoga-guide-controller/yoga.guide.controller");
const {
  encryptedAuthMiddleware,
} = require("../../middlewares/auth-middleware/auth.middleware");
const cloudinaryUtility = require("../../utilities/cloudinary-utility/cloudinary.utility");

/**
 * @description Create a new yoga guide
 * @route   POST /api/yoga/create-yoga-guide
 * @access  Private (SuperAdmin only)
 */
router.post(
  "/create-yoga-guide",
  encryptedAuthMiddleware,
  cloudinaryUtility.upload,
  yogaGuideController.createYogaGuide,
);

/**
 * @description Get all yoga guide
 * @route   GET /api/yoga/get-all-yoga-guides
 * @access  Public
 */
router.get("/get-all-yoga-guides", yogaGuideController.getAllYogaGuides);

/**
 * @description Get yoga guide
 * @route   GET /api/yoga/get-yoga-guide-by-id/:yogaId
 * @access  Public
 */
router.get(
  "/get-yoga-guide-by-id/:yogaId",
  yogaGuideController.getYogaGuideById,
);

/**
 * @description Update yoga guide
 * @route   PATCH /api/yoga/update-yoga-guide/:yogaId
 * @access  Private (SuperAdmin only)
 */
router.patch(
  "/update-yoga-guide/:yogaId",
  encryptedAuthMiddleware,
  cloudinaryUtility.upload,
  yogaGuideController.updateYogaGuide,
);

/**
 * @description Delete yoga guide
 * @route   DELETE /api/yoga/delete-yoga-guide/:yogaId
 * @access  Private (SuperAdmin only)
 */
router.delete(
  "/delete-yoga-guide/:yogaId",
  encryptedAuthMiddleware,
  yogaGuideController.deleteYogaGuide,
);

module.exports = router;
