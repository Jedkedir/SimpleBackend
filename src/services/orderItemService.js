/**
 * Service module for all OrderItem-related database operations.
 * @module src/services/orderItemService
 * @description Handles database operations related to Order Items.
 */
const db = require("../db/pool");
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
};

