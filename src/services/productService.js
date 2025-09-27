/**
 * Service module for all Product-related database operations.
 * @module src/services/productService
 * @description Handles all database operations related to the product entity.
 */
const db = require("../db/pool");
// --- CREATE ---
/**
 * Creates a new product in the database.
 * @param {Object} data - Object containing the product category ID, name, description, and base price.
 * @returns {Promise<number>} - A Promise that resolves to the ID of the created product.
 */
async function createProduct({ categoryId, name, description, basePrice }) {
  const sql = `SELECT create_product($1, $2, $3, $4) AS product_id;`;
  const params = [categoryId, name, description, basePrice];
  const result = await db.query(sql, params);
  return result.rows[0].product_id;
}

// --- READ ---
/**
 * Fetches a product by its ID from the database.
 * @param {number} productId - The ID of the product to fetch.
 * @returns {Promise<Object>} - A Promise that resolves to the fetched product object.
 */
async function getProductById(productId) {
  const sql = `SELECT * FROM get_product_by_id($1);`;
  const result = await db.query(sql, [productId]);
  return result.rows[0];
}

// --- UPDATE ---
/**
 * Updates a product in the database.
 * @param {number} productId - The ID of the product to update.
 * @param {Object} data - Object containing the product category ID, name, description, and base price to update.
 * @returns {Promise<boolean>} - A Promise that resolves to true if the product was updated successfully, false otherwise.
 */
async function updateProduct(productId, { categoryId, name, description, basePrice }) {
  const sql = `SELECT update_product($1, $2, $3, $4, $5) AS success;`;
  const params = [productId, categoryId, name, description, basePrice];
  const result = await db.query(sql, params);
  return result.rows[0].success;
}

// --- DELETE ---
/**
 * Deletes a product from the database.
 * @param {number} productId - The ID of the product to delete.
 * @returns {Promise<boolean>} - A Promise that resolves to true if the product was deleted successfully, false otherwise.
 */
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

