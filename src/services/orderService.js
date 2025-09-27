const db = require("../db/pool");

/**
 * Service module for all Order-related database operations.
 */

// --- CREATE (Checkout) ---
async function createOrderFromCart({
  userId,
  shippingAddressId,
  billingAddressId,
}) {
  // This function typically involves a transaction in the database (which you defined with triggers/procedures)
  const sql = `SELECT create_order_from_cart($1, $2, $3) AS order_id;`;
  const params = [userId, shippingAddressId, billingAddressId];
  const result = await db.query(sql, params);
  return result.rows[0].order_id;
}

// --- READ ---
async function getOrderById(orderId) {
  const sql = `SELECT * FROM get_order_by_id($1);`;
  const result = await db.query(sql, [orderId]);
  return result.rows[0];
}

// --- READ ---
async function getOrdersByUserId(userId) {
  const sql = `SELECT * FROM get_orders_by_user_id($1);`;
  const result = await db.query(sql, [userId]);
  return result.rows;
}

// --- UPDATE (Status) ---
async function updateOrderStatus(orderId, newStatus) {
  const sql = `SELECT update_order_status($1, $2) AS success;`;
  const result = await db.query(sql, [orderId, newStatus]);
  return result.rows[0].success;
}

module.exports = {
  createOrderFromCart,
  getOrderById,
  getOrdersByUserId,
  updateOrderStatus,
};
