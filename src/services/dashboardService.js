const db = require("../db/pool");

async function getTotalSold(userId) {
<<<<<<< HEAD
    const sql = `
        SELECT SUM(ord_items.quantity) AS total_sold FROM order_items ord_items
    `
    const result = await db.query(sql, [userId]);
    return result.rows
}

async function getTotalRevenue(userId) {
    const sql = `
        SELECT SUM(ord_it.quantity * ord_it.price) AS total_revenue FROM order_items ord_it
    `;
    const result = await db.query(sql, [userId])
    return result.rows;
}

async function getStockNotification(userId) {
    const sql = `
=======
  const sql = `
        SELECT SUM(ord_items.quantity) AS total_sold FROM order_items ord_items
    `;
  const result = await db.query(sql, [userId]);
  return result.rows;
}

async function getTotalRevenue(userId) {
  const sql = `
        SELECT SUM(ord_it.quantity * ord_it.price) AS total_revenue FROM order_items ord_it
    `;
  const result = await db.query(sql, [userId]);
  return result.rows;
}

async function getStockNotification(userId) {
  const sql = `
>>>>>>> 36164c6f5b45e3db9a6cec0bf761a9596690e1b0
        SELECT 
        prod.product_id, 
        prod.name, 
        prod_var.stock_quantity AS stock_notification
    FROM 
        products prod
    LEFT JOIN 
        product_variants prod_var ON prod.product_id = prod_var.product_id
    WHERE prod_var.stock_quantity < 20
<<<<<<< HEAD
    `
    const result = await db.query(sql, [userId])
    return result.rows
}

async function getOrderNotification(userId) {
    const sql = `
=======
    `;
  const result = await db.query(sql, [userId]);
  return result.rows;
}

async function getOrderNotification(userId) {
  const sql = `
>>>>>>> 36164c6f5b45e3db9a6cec0bf761a9596690e1b0
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
<<<<<<< HEAD
    `
    const result = await db.query(userId);
    return result.rows
}

module.exports = {
    getTotalSold,
    getTotalRevenue,
    getStockNotification,
    getOrderNotification
}
=======
    `;
  const result = await db.query(userId);
  return result.rows;
}

module.exports = {
  getTotalSold,
  getTotalRevenue,
  getStockNotification,
  getOrderNotification,
};
>>>>>>> 36164c6f5b45e3db9a6cec0bf761a9596690e1b0
