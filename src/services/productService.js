
const db = require("../db/pool");

async function createProduct({ categoryId, name, description, basePrice , image_url}) {
  const sql = `SELECT create_product($1, $2, $3, $4, $5) AS product_id;`;
  const params = [name, description, basePrice, categoryId, image_url];
  const result = await db.query(sql, params);
  return result.rows[0].product_id;
}


async function getProductById(productId) {
  const sql = `SELECT
      p.product_id,
      pv.variant_id,
      p.name,
      p.base_image_url,
      pv.image_url,
      p.description,
      pv.price,
      pv.size,
      pv.stock_quantity,
      pv.color,
      c.name AS catName,
      c.category_id
    FROM products p
    JOIN product_variants pv ON p.product_id = pv.product_id
    JOIN categories c ON p.category_id = c.category_id
    WHERE p.product_id = $1
`;
  const result = await db.query(sql, [productId]);
  return result.rows;
}


async function updateProduct(productId, { categoryId, name, description, basePrice , image_url}) {
  const sql = `SELECT update_product($1, $2, $3, $4, $5, $6) AS success;`;
  const params = [productId, categoryId, name, description, basePrice];
  const result = await db.query(sql, params);
  return result.rows[0].success;
}

async function getProductsByCatName(categoryName) {
  const sql = `SELECT 
    p.product_id, 
    p.name,
    p.price,
    p.base_image_url,
    p.description,
    c.name AS cat_name,
    pv.variant_id,
    pv.color,
    pv.size,
    pv.image_url AS variant_image_url,
    pv.stock_quantity,
    pv.price AS variant_price
    FROM products p 
    JOIN categories c ON p.category_id = c.category_id
    LEFT JOIN product_variants pv ON p.product_id = pv.product_id
    WHERE c.name = $1
    AND pv.variant_id IS NOT NULL
    LIMIT 10
    `;
  const params = [categoryName];
  const result = await db.query(sql, params);
  return result.rows;
}


async function deleteProduct(productId) {
  const sql = `SELECT delete_product($1) AS success;`;
  const result = await db.query(sql, [productId]);
  return result.rows[0].success;
}
async function getAllProducts() {
  const sql = `WITH product_reviews AS (
    SELECT 
      product_id,
      COUNT(review_id) AS review_count,
      COALESCE(AVG(rating), 0) AS average_rating
    FROM reviews
    GROUP BY product_id
  )
  SELECT
      p.product_id,
      p.name AS product_name,
      p.description,
      p.created_at,
      p.price AS base_price,      
      p.base_image_url,
      pv.variant_id,
      pv.color,
      pv.size,
      pv.price AS variant_price, 
      pv.stock_quantity,
      pv.image_url AS variant_image,
      c.name AS category_name,
      COALESCE(pr.review_count, 0) AS review_count,
      COALESCE(pr.average_rating, 0) AS average_rating
  FROM products p
  LEFT JOIN product_variants pv ON p.product_id = pv.product_id
  JOIN categories c ON p.category_id = c.category_id
  LEFT JOIN product_reviews pr ON p.product_id = pr.product_id
  ORDER BY p.product_id, pv.variant_id;`;

  const result = await db.query(sql);
  return result.rows;
}
module.exports = {
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductsByCatName
};

