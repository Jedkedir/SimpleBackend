/**
 * Service module for all CartItem-related database operations.
 * @module src/services/cartItemService
 */
const db = require("../db/pool");
/**
 * Creates a new cart item or updates quantity of an existing item.
 * @param { cartId, variantId, quantity } - Object containing cartId, variantId, and quantity.
 * @returns { cartItemId } - The ID of the new cart item or existing cart item.
 */
async function addOrUpdateCartItem({ userId, variantId, quantity }) {
  // Assumes a function that handles both adding a new item or updating quantity
  const sql = `SELECT add_to_cart($1, $2, $3) AS cart_item_id;`;
  const params = [userId, variantId, quantity];
  const result = await db.query(sql, params);
  console.log(result.rows[0])
  return result.rows[0].cart_item_id;
}

/**
 * Fetches all cart items for a given cart ID.
 * @param cartId - The ID of the cart.
 * @returns { rows } - An array of objects containing cart item information.
 */
async function getCartItems(cartId) {
  const sql = `SELECT * FROM get_cart_items_by_cart_id($1);`;
  const result = await db.query(sql, [cartId]);
  return result.rows;
}

/**
 * Deletes a cart item by its ID.
 * @param cartItemId - The ID of the cart item to delete.
 * @returns { success } - A boolean indicating whether the deletion was successful.
 */
async function removeCartItem(cartItemId) {
  const query = `
    DELETE FROM cart_items
    WHERE cart_item_id = $1
    RETURNING TRUE AS success;
  `;
  const result = await db.query(query, [cartItemId]);
  return result.rows[0].success;
}

module.exports = {
  addOrUpdateCartItem,
  getCartItems,
  removeCartItem,
};

