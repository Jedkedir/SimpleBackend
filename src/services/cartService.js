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
  const query = "INSERT INTO carts (user_id) VALUES ($1) RETURNING *";
  const result = await db.query(query, [userId]);
  return result.rows[0].cart_id;
}

// --- READ ---
/**
 * Retrieves the cart details of a given user ID.
 * @param {number} userId - The ID of the user to retrieve the cart for.
 * @returns {Promise<object} The cart object containing cart details.
 */
async function getCartByUserId(userId) {
  const query = `
    SELECT c.cart_id, c.user_id, c.created_at
    FROM carts c
    WHERE c.user_id = $1
  `;
  const result = await db.query(query, [userId]);
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
  const query = `
    DELETE FROM carts c
    WHERE c.cart_id = $1
  `;
  const result = await db.query(query, [cartId]);
  return result.rowCount === 1;
}

module.exports = {
  createCart,
  getCartByUserId,
  deleteCart,
};

