/**
 * Service module for all Review-related database operations.
 *
 * @module src/services/reviewService
 * @description Handles creation, reading, updating, and deletion of reviews in the database.
 */
const db = require("../db/pool");
// --- CREATE ---
/**
 * Creates a new review.
 * @param {Object} { userId, productId, rating, content } - Object containing user ID, product ID, rating, and content.
 * @returns {Promise<number>} - A Promise that resolves to the ID of the new review.
 */
async function createReview({ userId, productId, rating, content }) {
  const sql = `SELECT create_review($1, $2, $3, $4) AS review_id;`;
  const params = [userId, productId, rating, content];
  const result = await db.query(sql, params);
  return result.rows[0].review_id;
}

// --- READ ---
/**
 * Fetches all reviews for a given product ID.
 * @param {number} productId - The ID of the product to fetch reviews for.
 * @returns {Promise<Object[]>} - A Promise that resolves to an array of review objects.
 */
async function getReviewsByProductId(productId) {
  const sql = `SELECT * FROM get_reviews_by_product_id($1);`;
  const result = await db.query(sql, [productId]);
  return result.rows;
}

// --- UPDATE ---
/**
 * Updates a review.
 * @param {number} reviewId - The ID of the review to update.
 * @param {Object} { rating, content } - Object containing the rating and content to update.
 * @returns {Promise<boolean>} - A Promise that resolves to true if the review was updated successfully, false otherwise.
 */
async function updateReview(reviewId, { rating, content }) {
  const sql = `SELECT update_review($1, $2, $3) AS success;`;
  const params = [reviewId, rating, content];
  const result = await db.query(sql, params);
  return result.rows[0].success;
}

// --- DELETE ---
/**
 * Deletes a review.
 * @param {number} reviewId - The ID of the review to delete.
 * @returns {Promise<boolean>} - A Promise that resolves to true if the review was deleted successfully, false otherwise.
 */
async function deleteReview(reviewId) {
  const sql = `SELECT delete_review($1) AS success;`;
  const result = await db.query(sql, [reviewId]);
  return result.rows[0].success;
}

module.exports = {
  createReview,
  getReviewsByProductId,
  updateReview,
  deleteReview,
};

