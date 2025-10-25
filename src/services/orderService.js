
const { getOrderHistory } = require("../controllers/orderController");
const db = require("../db/pool");

async function createOrderFromCart({
  userId,
  total_amount,
  shippingAddressId
}) {
 const sql = `SELECT create_order($1, $2, $3) AS order_id;`;
  const params = [userId, shippingAddressId, total_amount];
  const result = await db.query(sql, params);
  return result.rows[0].order_id;
}


async function getOrderById(orderId) {
  const sql = `SELECT * FROM get_order_by_id($1);`;
  const result = await db.query(sql, [orderId]);
  return result.rows[0];
}


async function getOrdersByUserId(userId) {
  const sql = `SELECT * FROM get_orders_by_user_id($1);`;
  const result = await db.query(sql, [userId]);
  return result.rows;
}


async function updateOrderStatus(orderId, newStatus) {
  const sql = `SELECT update_order_status($1, $2) AS success;`;
  const result = await db.query(sql, [orderId, newStatus]);
  return result.rows[0].success;
}

async function fetchOrderHistory(userId) {
  const sql = `
    SELECT 
      o.order_id,
      o.order_date,
      p.name AS product_name,
      p.base_image_url,
      oi.price,
      oi.quantity,
      a.address_line_1,
      pv.color
  FROM orders o
  JOIN order_items oi ON o.order_id = oi.order_id
  JOIN product_variants pv ON oi.variant_id = pv.variant_id
  JOIN products p ON pv.product_id = p.product_id
  JOIN addresses a ON o.shipping_address_id = a.address_id
  WHERE o.user_id = $1
  ORDER BY o.order_date DESC;
  `
  const result = await db.query(sql, [userId]);
  return result.rows
}
module.exports = {
  createOrderFromCart,
  getOrderById,
  getOrdersByUserId,
  updateOrderStatus,
  fetchOrderHistory
};

