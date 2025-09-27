const db = require("../db/pool");

/**
 * Service module for all Review-related database operations.
 */

// --- CREATE ---
async function createReview({ userId, productId, rating, content }) {
  const sql = `SELECT create_review($1, $2, $3, $4) AS review_id;`;
  const params = [userId, productId, rating, content];
  const result = await db.query(sql, params);
  return result.rows[0].review_id;
}

// --- READ ---
async function getReviewsByProductId(productId) {
  const sql = `SELECT * FROM get_reviews_by_product_id($1);`;
  const result = await db.query(sql, [productId]);
  return result.rows;
}

// --- UPDATE ---
async function updateReview(reviewId, { rating, content }) {
  const sql = `SELECT update_review($1, $2, $3) AS success;`;
  const params = [reviewId, rating, content];
  const result = await db.query(sql, params);
  return result.rows[0].success;
}

// --- DELETE ---
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
