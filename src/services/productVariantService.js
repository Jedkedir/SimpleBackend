
const db = require("../db/pool");

async function createVariant({
  productId,
  color,
  size,
  stockQuantity,
  priceModifier,
  image_url
}) {
  const sql = `SELECT create_product_variant($1, $2, $3, $4, $5, $6) AS variant_id;`;
  const params = [productId, color, size, stockQuantity, priceModifier, image_url];
  const result = await db.query(sql, params);
  return result.rows[0].variant_id;
}


async function getVariantById(variantId) {
  const sql = `SELECT * FROM get_product_variant_by_id($1);`;
  const result = await db.query(sql, [variantId]);
  return result.rows[0];
}


async function updateVariant(
  variantId,
  { image_url, color, size, priceModifier, stockQuantity}
) {
  const sql = `SELECT update_product_variant($1, $2, $3, $4, $5, $6) AS success;`;
  const params = [variantId, color, size, stockQuantity, priceModifier,image_url];
  const result = await db.query(sql, params);
  return result.rows[0].success;
}


async function deleteVariant(variantId) {
  const sql = `SELECT delete_product_variant($1) AS success;`;
  const result = await db.query(sql, [variantId]);
  return result.rows[0].success;
}


async function updateVariantStock(variantId, quantityChange) {
  const sql = `SELECT update_variant_stock($1, $2) AS new_stock;`;
  const result = await db.query(sql, [variantId, quantityChange]);
  return result.rows[0].new_stock;
}

module.exports = {
  createVariant,
  getVariantById,
  updateVariant,
  deleteVariant,
  updateVariantStock,
};

