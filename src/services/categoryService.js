const db = require("../db/pool");

/**
 * Service module for all Category-related database operations.
 */

// --- CREATE ---
async function createCategory({ name, description }) {
  const sql = `SELECT create_category($1, $2) AS category_id;`;
  const params = [name, description];
  const result = await db.query(sql, params);
  return result.rows[0].category_id;
}

// --- READ ---
async function getAllCategories() {
  const sql = `SELECT * FROM get_all_categories();`;
  const result = await db.query(sql);
  return result.rows;
}

// --- UPDATE ---
async function updateCategory(categoryId, { name, description }) {
  const sql = `SELECT update_category($1, $2, $3) AS success;`;
  const params = [categoryId, name, description];
  const result = await db.query(sql, params);
  return result.rows[0].success;
}

// --- DELETE ---
async function deleteCategory(categoryId) {
  const sql = `SELECT delete_category($1) AS success;`;
  const result = await db.query(sql, [categoryId]);
  return result.rows[0].success;
}

module.exports = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};
