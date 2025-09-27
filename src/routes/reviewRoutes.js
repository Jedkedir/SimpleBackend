/**
 * Review API Routes
 * Base Path: /api/reviews
 * @module src/routes/reviewRoutes
 * @description This file contains API routes for the Review entity.
 */

const express = require("express");
const router = express.Router();

const {
  /**
   * Controller for posting a new review.
   * @function createReviewController
   * @param {Request} req - The Express request object
   * @param {Response} res - The Express response object
   */
  createReviewController,
  /**
   * Controller for fetching all reviews for a product.
   * @function getReviewsByProductIdController
   * @param {Request} req - The Express request object
   * @param {Response} res - The Express response object
   */
  getReviewsByProductIdController,
  /**
   * Controller for updating an existing review.
   * @function updateReviewController
   * @param {Request} req - The Express request object
   * @param {Response} res - The Express response object
   */
  updateReviewController,
  /**
   * Controller for deleting a review.
   * @function deleteReviewController
   * @param {Request} req - The Express request object
   * @param {Response} res - The Express response object
   */
  deleteReviewController,
} = require("../controllers/reviewController");

// POST /api/reviews (Submit a new review)
router.post("/", createReviewController);

// GET /api/reviews/product/:productId (Fetch reviews for a product)
router.get("/product/:productId", getReviewsByProductIdController);

// PUT /api/reviews/:id (Update an existing review)
router.put("/:id", updateReviewController);

// DELETE /api/reviews/:id (Delete a review)
router.delete("/:id", deleteReviewController);

module.exports = router;

