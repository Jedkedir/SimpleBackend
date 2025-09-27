const db = require("../db/pool");

/**
 * Service module for all Product-related database operations.
 */

// --- CREATE ---
async function createProduct({ categoryId, name, description, basePrice }) {
  const sql = `SELECT create_product($1, $2, $3, $4) AS product_id;`;
  const params = [categoryId, name, description, basePrice];
  const result = await db.query(sql, params);
  return result.rows[0].product_id;
}

// --- READ ---
async function getProductById(productId) {
  const sql = `SELECT * FROM get_product_by_id($1);`;
  const result = await db.query(sql, [productId]);
  return result.rows[0];
}

// --- UPDATE ---
async function updateProduct(
  productId,
  { categoryId, name, description, basePrice }
) {
  const sql = `SELECT update_product($1, $2, $3, $4, $5) AS success;`;
  const params = [productId, categoryId, name, description, basePrice];
  const result = await db.query(sql, params);
  return result.rows[0].success;
}

// --- DELETE ---
async function deleteProduct(productId) {
  const sql = `SELECT delete_product($1) AS success;`;
  const result = await db.query(sql, [productId]);
  return result.rows[0].success;
}

module.exports = {
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
};
