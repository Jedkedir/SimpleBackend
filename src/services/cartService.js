const db = require("../db/pool");

/**
 * Service module for all Cart-related database operations (the main cart record).
 */

// --- CREATE ---
async function createCart(userId) {
  // Note: A user's cart is often created automatically upon user creation or first session
  const sql = `SELECT create_cart($1) AS cart_id;`;
  const result = await db.query(sql, [userId]);
  return result.rows[0].cart_id;
}

// --- READ ---
async function getCartByUserId(userId) {
  const sql = `SELECT * FROM get_cart_by_user_id($1);`;
  const result = await db.query(sql, [userId]);
  return result.rows[0];
}

// --- DELETE ---
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
