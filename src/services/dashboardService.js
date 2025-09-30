const db = require("../db/pool");

async function getTotalSold() {
  const sql = `
        SELECT SUM(ord_items.quantity) AS total_sold FROM order_items ord_items
    `;
  const result = await db.query(sql);
  return result.rows[0];
}

async function getTotalRevenue() {
  const sql = `
        SELECT SUM(ord_it.quantity * ord_it.price) AS total_revenue FROM order_items ord_it
    `;
  const result = await db.query(sql);
  return result.rows[0];
}

async function getStockNotification() {
  const sql = `
        SELECT 
        prod.product_id, 
        prod.name, 
        prod_var.stock_quantity AS stock_notification
    FROM 
        products prod
    LEFT JOIN 
        product_variants prod_var ON prod.product_id = prod_var.product_id
    WHERE prod_var.stock_quantity < 20
    `;
  const result = await db.query(sql);
  return result.rows[0];
}

async function getOrderNotification() {
  const sql = `
        SELECT 
            p.product_id,
            p.name AS product_name,
            o.user_id,
            o.order_date,
            o.status
        FROM orders o
        JOIN order_items oi ON o.order_id = oi.order_id
        JOIN product_variants pv ON oi.variant_id = pv.variant_id
        JOIN products p ON pv.product_id = p.product_id;
    `;
  const result = await db.query(sql);
  return result.rows[0];
}

async function getTopSelling() {
  const sql = `
    SELECT 
      p.product_id,
      p.base_image_url,
      SUM(oi.quantity) AS total_sold
    FROM order_items oi
      JOIN orders o ON oi.order_id = o.order_id
      JOIN product_variants pv ON oi.variant_id = pv.variant_id
      JOIN products p ON pv.product_id = p.product_id
      GROUP BY p.product_id, p.name, p.price, p.base_image_url
      ORDER BY total_sold DESC
      LIMIT 10
  `
  const result = await db.query(sql);
  return result.rows[0]
}

module.exports = {
  getTotalSold,
  getTotalRevenue,
  getStockNotification,
  getOrderNotification,
  getTopSelling
};
