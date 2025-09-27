const express = require("express");
const router = express.Router();
const {
  createReviewController,
  getReviewsByProductIdController,
  updateReviewController,
  deleteReviewController,
} = require("../controllers/reviewController");

/**
 * Review API Routes
 * Base Path: /api/reviews
 */

router.post("/", createReviewController); // POST /api/reviews (Submit a new review)
router.get("/product/:productId", getReviewsByProductIdController); // GET /api/reviews/product/:productId (Fetch reviews for a product)
router.put("/:id", updateReviewController); // PUT /api/reviews/:id (Update an existing review)
router.delete("/:id", deleteReviewController); // DELETE /api/reviews/:id (Delete a review)

module.exports = router;
