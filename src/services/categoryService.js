
const db = require("../db/pool");

async function createCategory({ name, description }) {
  const sql = `SELECT create_category($1, $2) AS category_id;`;
  const params = [name, description];
  const result = await db.query(sql, params);
  return result.rows[0].category_id;
}


async function getAllCategories() {
  const sql = `SELECT * FROM get_all_categories();`;
  const result = await db.query(sql);
  return result.rows;
}


async function updateCategory(categoryId, { name, description }) {
  const sql = `SELECT update_category($1, $2, $3) AS success;`;
  const params = [categoryId, name, description];
  const result = await db.query(sql, params);
  return result.rows[0].success;
}


async function deleteCategory(categoryId) {
  const sql = `SELECT delete_category($1) AS success;`;
  const result = await db.query(sql, [categoryId]);
  return result.rows[0].success;
}

async function getCategoryByName(categoryName) {
  console.log(categoryName);
  const sql = `SELECT category_id FROM categories WHERE name = $1;`;
  const result = await db.query(sql, [categoryName]);
  return result.rows[0] ? result.rows[0].category_id : null;
}
module.exports = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
  getCategoryByName
};

