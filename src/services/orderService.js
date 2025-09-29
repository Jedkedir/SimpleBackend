/**
 * Service module for all Order-related database operations.
 *
 * @module src/services/orderService
 * @description This module provides functions for creating, reading and updating orders.
 */
const db = require("../db/pool");
// --- CREATE (Checkout) ---
/**
 * Creates a new order from a user's cart.
 * @param {number} userId - The ID of the user to create an order for.
 * @param {number} shippingAddressId - The ID of the shipping address to use.
 * @param {number} total - The ID of the billing address to use.
 * @returns {Promise<number>} The ID of the newly created order.
 */
async function createOrderFromCart({
  userId,
  total_amount,
  shippingAddressId
}) {
  // This function typically involves a transaction in the database (which you defined with triggers/procedures).
  const sql = `SELECT create_order($1, $2, $3) AS order_id;`;
  const params = [userId, total_amount,shippingAddressId];
  const result = await db.query(sql, params);
  return result.rows[0].order_id;
}

// --- READ ---
/**
 * Retrieves an order by its ID.
 * @param {number} orderId - The ID of the order to retrieve.
 * @returns {Promise<object>} The retrieved order object.
 */
async function getOrderById(orderId) {
  const sql = `SELECT * FROM get_order_by_id($1);`;
  const result = await db.query(sql, [orderId]);
  return result.rows[0];
}

// --- READ ---
/**
 * Retrieves all orders for a given user ID.
 * @param {number} userId - The ID of the user to retrieve orders for.
 * @returns {Promise<object[]> The retrieved order objects.
 */
async function getOrdersByUserId(userId) {
  const sql = `SELECT * FROM get_orders_by_user_id($1);`;
  const result = await db.query(sql, [userId]);
  return result.rows;
}

// --- UPDATE (Status) ---
/**
 * Updates an order's status.
 * @param {number} orderId - The ID of the order to update.
 * @param {string} newStatus - The new status of the order.
 * @returns {Promise<boolean>} True if the order was successfully updated, false otherwise.
 */
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

