const db = require("../db/pool");

/**
 * Service module for all CartItem-related database operations.
 */

// --- CREATE/UPSERT (Add/Update) ---
async function addOrUpdateCartItem({ cartId, variantId, quantity }) {
  // Assumes a function that handles both adding a new item or updating quantity
  const sql = `SELECT add_or_update_cart_item($1, $2, $3) AS cart_item_id;`;
  const params = [cartId, variantId, quantity];
  const result = await db.query(sql, params);
  return result.rows[0].cart_item_id;
}

// --- READ ---
async function getCartItems(cartId) {
  const sql = `SELECT * FROM get_cart_items_by_cart_id($1);`;
  const result = await db.query(sql, [cartId]);
  return result.rows;
}

// --- DELETE ---
async function removeCartItem(cartItemId) {
  const sql = `SELECT delete_cart_item($1) AS success;`;
  const result = await db.query(sql, [cartItemId]);
  return result.rows[0].success;
}

module.exports = {
  addOrUpdateCartItem,
  getCartItems,
  removeCartItem,
};
