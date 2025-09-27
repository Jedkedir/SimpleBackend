/**
 * Service module for all Cart-related database operations (the main cart record).
 * @module src/services/cartService
 * @description Handles all database operations related to the cart entity.
 */
const db = require("../db/pool");
// --- CREATE ---
/**
 * Creates a new cart for a given user ID.
 * @param {number} userId - The ID of the user to create a cart for.
 * @returns {Promise<number>} The ID of the newly created cart.
 */
async function createCart(userId) {
  // Note: A user's cart is often created automatically upon user creation or first session
  const sql = `SELECT create_cart($1) AS cart_id;`;
  const result = await db.query(sql, [userId]);
  return result.rows[0].cart_id;
}

// --- READ ---
/**
 * Retrieves the cart details of a given user ID.
 * @param {number} userId - The ID of the user to retrieve the cart for.
 * @returns {Promise<object} The cart object containing cart details.
 */
async function getCartByUserId(userId) {
  const sql = `SELECT * FROM get_cart_by_user_id($1);`;
  const result = await db.query(sql, [userId]);
  return result.rows[0];
}

// --- DELETE ---
/**
 * Deletes a cart by its ID.
 * @param {number} cartId - The ID of the cart to delete.
 * @returns {Promise.boolean} A boolean indicating whether the deletion was successful.
 */
async function deleteCart(cartId) {
  // This typically clears the cart after a successful checkout or user action
  const sql = `SELECT delete_cart($1) AS success;`;
  const result = await db.query(sql, [cartId]);
  return result.rows[0].success;
}

module.exports = {
  createCart,
  getCartByUserId,
  deleteCart,
};

