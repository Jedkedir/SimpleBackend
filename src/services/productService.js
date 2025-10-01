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
async function createProduct({ categoryId, name, description, basePrice , image_url}) {
  const sql = `SELECT create_product($1, $2, $3, $4, $5) AS product_id;`;
  const params = [name, description, basePrice, categoryId, image_url];
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
  const sql = `SELECT
      p.product_id,
      p.name,
      p.base_image_url,
      pv.image_url,
      p.description,
      pv.price,
      pv.size,
      pv.stock_quantity,
      pv.color,
      c.name AS catName,
      c.category_id,
      pv.variant_id
    FROM products p
    JOIN product_variants pv ON p.product_id = pv.product_id
    JOIN categories c ON p.category_id = c.category_id
    WHERE p.product_id = $1
`;
  const result = await db.query(sql, [productId]);
  return result.rows;
}

// --- UPDATE ---
/**
 * Updates a product in the database.
 * @param {number} productId - The ID of the product to update.
 * @param {Object} data - Object containing the product category ID, name, description, and base price to update.
 * @returns {Promise<boolean>} - A Promise that resolves to true if the product was updated successfully, false otherwise.
 */
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
    c.name AS CAT_NAME
    FROM products p 
    JOIN categories c ON p.product_id = c.category_id
    WHERE c.name = $1
    `
    const params = [categoryName];
    const result = await db.query(sql, params);
    return result.rows;
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
async function getAllProducts() {
  const sql = ` SELECT
      p.product_id,
      p.name AS product_name,
      p.description,
      p.price AS base_price,      
      p.base_image_url,
      pv.variant_id,
      pv.color,
      pv.size,
      pv.price AS variant_price, 
      pv.stock_quantity,
      pv.image_url AS variant_image,
      c.name AS category_name
  FROM products p
  LEFT JOIN product_variants pv ON p.product_id = pv.product_id
  JOIN categories c ON p.category_id = c.category_id
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

