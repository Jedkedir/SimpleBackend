/**
 * Service module for all OrderItem-related database operations.
 * @module src/services/orderItemService
 * @description Handles database operations related to Order Items.
 */
const db = require("../db/pool");

async function createOrderItems( orderId, variantId,quantity,price ) {
  const sql = `SELECT create_order_item($1, $2, $3,$4) AS orderItem_id`;
  const params = [orderId, variantId, quantity, price];
  const result = await db.query(sql, params);
  return result.rows[0].orderItem_id;
}
// --- READ ---
/**
 * Fetches all order items for a given order ID.
 * @param orderId - The ID of the order.
 * @returns { rows } - An array of objects containing order item information.
 */
async function getOrderItems(orderId) {
  const sql = `SELECT * FROM get_order_items_by_order_id($1);`;
  const result = await db.query(sql, [orderId]);
  return result.rows;
}

module.exports = {
  getOrderItems,
  createOrderItems
};

