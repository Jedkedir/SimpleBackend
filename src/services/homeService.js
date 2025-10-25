const db = require("../db/pool");

async function getBestSelling() {
  const sql = `
      SELECT 
    p.product_id,
    pv.variant_id,
    p.name,
    p.description,
    pv.image_url AS variant_image,
    pv.price,
    SUM(oi.quantity) AS total_sold
FROM order_items oi
JOIN orders o ON oi.order_id = o.order_id
JOIN product_variants pv ON oi.variant_id = pv.variant_id
JOIN products p ON pv.product_id = p.product_id
GROUP BY p.product_id, pv.variant_id, pv.image_url, pv.price
ORDER BY total_sold DESC
LIMIT 10;

    `;
  const result = await db.query(sql);
  return result.rows;
}

async function getFeatures() {
  const sql = `
    SELECT p.product_id, p.name, p.price, p.base_image_url, c.name AS category_name
    FROM products p
    JOIN categories c ON p.category_id = c.category_id
    WHERE p.product_id IN (
        SELECT MIN(product_id) 
        FROM products 
        GROUP BY category_id
    )
    LIMIT 10;
  `;
  const result = await db.query(sql);
  return result.rows;
}

module.exports = {
  getBestSelling,
  getFeatures,
};
