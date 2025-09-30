/**
 * Service module for all Category-related database operations.
 *
 * @module src/services/categoryService
 * @description Handles creation, reading, updating, and deletion of categories in the database.
 */
const db = require("../db/pool");
// --- CREATE ---
/**
 * Creates a new category in the database.
 * @param {Object} data - Object containing the category name and description.
 * @returns {Promise<number>} - A Promise that resolves to the newly created category ID.
 */
async function createCategory({ name, description }) {
  const sql = `SELECT create_category($1, $2) AS category_id;`;
  const params = [name, description];
  const result = await db.query(sql, params);
  return result.rows[0].category_id;
}

// --- READ ---
/**
 * Retrieves all categories from the database.
 * @returns {Promise<Array<Category>>} - A Promise that resolves to an array of category objects.
 */
async function getAllCategories() {
  const sql = `SELECT * FROM get_all_categories();`;
  const result = await db.query(sql);
  return result.rows;
}

// --- UPDATE ---
/**
 * Updates a category in the database.
 * @param {number} categoryId - The ID of the category to update.
 * @param {Object} data - Object containing the category name and description to update.
 * @returns {Promise<boolean>} - A Promise that resolves to true if the category was updated successfully, false otherwise.
 */
async function updateCategory(categoryId, { name, description }) {
  const sql = `SELECT update_category($1, $2, $3) AS success;`;
  const params = [categoryId, name, description];
  const result = await db.query(sql, params);
  return result.rows[0].success;
}

// --- DELETE ---
/**
 * Deletes a category from the database.
 * @param {number} categoryId - The ID of the category to delete.
 * @returns {Promise<boolean>} - A Promise that resolves to true if the category was deleted successfully, false otherwise.
 */
async function deleteCategory(categoryId) {
  const sql = `SELECT delete_category($1) AS success;`;
  const result = await db.query(sql, [categoryId]);
  return result.rows[0].success;
}

async function getCategoryByName(categoryName) {
  const sql = `SELECT category_id FROM categories WHERE name = $1;`;
  const result = await db.query(sql, [categoryName]);
  return result.rows[0];
}
module.exports = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
  getCategoryByName
};

