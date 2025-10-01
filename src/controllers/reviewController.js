/**
 * Handles HTTP requests for the Review entity.
 * @module src/controllers/reviewController
 * @description This module contains all controller functions for the Review entity.
 */
const reviewService = require("../services/reviewService");
/**
 * Creates a new review.
 * @function createReviewController
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Promise} - A Promise that resolves to the review ID or an error message.
 */
exports.createReviewController = async (req, res) => {
  try {
    const { userId, productId, rating, content } = req.body;

    if (
      !userId ||
      !productId ||
      rating === undefined ||
      rating < 1 ||
      rating > 5
    ) {
      return res
        .status(400)
        .json({ error: "Missing or invalid userId, productId, or rating." });
    }

    const reviewId = await reviewService.createReview({
      userId,
      productId,
      rating,
      content,
    });

    res.status(201).json({
      message: "Review posted successfully",
      reviewId,
    });
  } catch (error) {
    console.error("Error creating review:", error.message);
    res.status(500).json({ error: "Failed to create review" });
  }
};

/**
 * Fetches all reviews for a product.
 * @function getReviewsByProductIdController
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Promise} - A Promise that resolves to an array of review objects or an error message.
 */
exports.getReviewsByProductIdController = async (req, res) => {
  try {
    const productId = parseInt(req.params.productId);

    if (isNaN(productId)) {
      return res.status(400).json({ error: "Invalid product ID format." });
    }

    const reviews = await reviewService.getReviewsByProductId(productId);
    res.status(200).json({
      reviewsRes: reviews
    });
  } catch (error) {
    console.error("Error fetching reviews:", error.message);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};

/**
 * Updates an existing review.
 * @function updateReviewController
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Promise} - A Promise that resolves to the review ID or an error message.
 */
exports.updateReviewController = async (req, res) => {
  try {
    const reviewId = parseInt(req.params.id);
    const { rating, content } = req.body;

    if (isNaN(reviewId)) {
      return res.status(400).json({ error: "Invalid review ID format." });
    }

    const success = await reviewService.updateReview(reviewId, {
      rating,
      content,
    });

    if (!success) {
      return res
        .status(404)
        .json({ error: "Review not found or nothing to update." });
    }

    res.status(200).json({ message: "Review updated successfully" });
  } catch (error) {
    console.error("Error updating review:", error.message);
    res.status(500).json({ error: "Failed to update review" });
  }
};

/**
 * Deletes a review.
 * @function deleteReviewController
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Promise} - A Promise that resolves to a success message or an error message.
 */
exports.deleteReviewController = async (req, res) => {
  try {
    const reviewId = parseInt(req.params.id);

    if (isNaN(reviewId)) {
      return res.status(400).json({ error: "Invalid review ID format." });
    }

    const success = await reviewService.deleteReview(reviewId);

    if (!success) {
      return res.status(404).json({ error: "Review not found" });
    }

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting review:", error.message);
    res.status(500).json({ error: "Failed to delete review" });
  }
};

