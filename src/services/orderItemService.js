const db = require("../db/pool");

/**
 * Service module for all OrderItem-related database operations.
 */

// --- READ ---
async function getOrderItems(orderId) {
  const sql = `SELECT * FROM get_order_items_by_order_id($1);`;
  const result = await db.query(sql, [orderId]);
  return result.rows;
}

module.exports = {
  getOrderItems,
};
