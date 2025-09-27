const db = require("../db/pool");

/**
 * Service module for all Payment-related database operations.
 */

// --- CREATE ---
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
async function getPaymentsByOrderId(orderId) {
  const sql = `SELECT * FROM get_payments_by_order_id($1);`;
  const result = await db.query(sql, [orderId]);
  return result.rows;
}

// --- UPDATE ---
async function updatePaymentStatus(paymentId, newStatus) {
  const sql = `SELECT update_payment_status($1, $2) AS success;`;
  const result = await db.query(sql, [paymentId, newStatus]);
  return result.rows[0].success;
}

module.exports = {
  createPayment,
  getPaymentsByOrderId,
  updatePaymentStatus,
};
