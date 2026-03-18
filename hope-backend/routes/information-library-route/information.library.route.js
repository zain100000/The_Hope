/**
 * @fileoverview Express routes for Information Library
 * @module routes/informationLibraryRoutes
 */

const express = require("express");
const router = express.Router();

// Import the correct controller
const libraryController = require("../../controllers/information-library-controller/information.library.controller");
const cloudinaryUtility = require("../../utilities/cloudinary-utility/cloudinary.utility");

// Import middlewares
const {
  encryptedAuthMiddleware,
} = require("../../middlewares/auth-middleware/auth.middleware");

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN ROUTES (Super Admin Only)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @description Publish new article with thumbnails (Max 3)
 * @route   POST /api/library/create-article
 * @access  Private (Super Admin)
 */
router.post(
  "/create-article",
  encryptedAuthMiddleware,
  cloudinaryUtility.upload,
  libraryController.createArticle,
);

/**
 * @description Get article by id
 * @route   GET /api/library/get-article-by-id/:articleId
 * @access  Private (User)
 */
router.get(
  "/get-article-by-id/:articleId",
  encryptedAuthMiddleware,
  libraryController.getArticleById,
);

/**
 * @description Update existing article
 * @route   PATCH /api/library/update-article/:articleId
 * @access  Private (Super Admin)
 */
router.patch(
  "/update-article/:articleId",
  encryptedAuthMiddleware,
  cloudinaryUtility.upload,
  libraryController.updateArticle,
);

/**
 * @description Delete article and clean up Cloudinary
 * @route   DELETE /api/library/delete-article/:articleId
 * @access  Private (Super Admin)
 */
router.delete(
  "/delete-article/:articleId",
  encryptedAuthMiddleware,
  libraryController.deleteArticle,
);

// ─────────────────────────────────────────────────────────────────────────────
// USER ROUTES (Browsing & Reading)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @description Get all published articles (Filters: category, search)
 * @route   GET /api/library/get-all
 * @access  Private (User)
 */
router.get("/get-all-articles", libraryController.getLibrary);

/**
 * @description Get single article details by Slug
 * @route   GET /api/library/read/:slug
 * @access  Private (User)
 */
router.get(
  "/read/:slug",
  encryptedAuthMiddleware,
  libraryController.getArticleBySlug,
);

module.exports = router;
