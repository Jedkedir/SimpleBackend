/**
 * Service module for all Payment-related database operations.
 *
 * @module src/services/paymentService
 * @description Handles database operations related to the Payment entity.
 */
const db = require("../db/pool");
// --- CREATE ---
/**
 * Creates a new payment record.
 *
 * @param {number} orderId - The ID of the order associated with the payment.
 * @param {number} amount - The amount of the payment.
 * @param {string} method - The payment method used (e.g., card, cash).
 * @param {string} transactionId - The transaction ID associated with the payment.
 * @param {string} status - The status of the payment (e.g., success, failed).
 * @returns {Promise<number>} The ID of the created payment record.
 */
async function createPayment({
  orderId,
  amount,
  method,
  transactionId,
  status,
}) {
  const sql = `SELECT create_payment($1, $2, $3, $4, $5) AS payment_id;`;
  const params = [orderId, amount, method, transactionId, status];
  const result = await db.query(sql, params);
  return result.rows[0].payment_id;
}

// --- READ ---
/**
 * Fetches all payment records associated with an order ID.
 *
 * @param {number} orderId - The ID of the order to fetch payment records for.
 * @returns {Promise<object[]>} An array of objects containing payment record information.
 */
async function getPaymentsByOrderId(orderId,payment_amount,payment_method,transaction_id,status) {
  const sql = `SELECT * FROM get_payments_by_order_id($1);`;
  const result = await db.query(sql, [
    orderId,
    payment_amount,
    payment_method,
    transaction_id,
    status,
  ]);
  return result.rows;
}

// --- UPDATE ---
/**
 * Updates the status of a payment record.
 *
 * @param {number} paymentId - The ID of the payment record to update.
 * @param {string} newStatus - The new status of the payment record.
 * @returns {Promise<boolean>} True if the payment record was successfully updated, false otherwise.
 */
async function updatePaymentStatus(paymentId, newStatus) {
  const sql = `SELECT update_payment_status($1, $2) AS success;`;
  const result = await db.query(sql, [paymentId, newStatus]);
  return result.rows[0];
}

module.exports = {
  createPayment,
  getPaymentsByOrderId,
  updatePaymentStatus,
};

