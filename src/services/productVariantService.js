/**
 * Service module for all ProductVariant-related database operations.
 * @module src/services/productVariantService
 * @description Handles database operations related to Product Variants.
 */
const db = require("../db/pool");
// --- CREATE ---
/**
 * Creates a new product variant.
<<<<<<< HEAD
 * @param {productId, image_url, color, size, priceModifier, stockQuantity} - Object containing product ID, SKU, color, size, price modifier, and stock quantity.
=======
 * @param {productId, imageUrl, color, size, priceModifier, stockQuantity} - Object containing product ID, imageUrl, color, size, price modifier, and stock quantity.
>>>>>>> 36164c6f5b45e3db9a6cec0bf761a9596690e1b0
 * @returns {variantId} - The ID of the new product variant.
 */
async function createVariant({
  productId,
<<<<<<< HEAD
=======
  imageUrl,
>>>>>>> 36164c6f5b45e3db9a6cec0bf761a9596690e1b0
  color,
  size,
  stockQuantity,
  priceModifier,
  image_url
}) {
  const sql = `SELECT create_product_variant($1, $2, $3, $4, $5, $6) AS variant_id;`;
<<<<<<< HEAD
  const params = [productId, color, size, stockQuantity, priceModifier, image_url];
=======
  const params = [
    productId,
    color,
    size,
    stockQuantity,
    priceModifier,
    imageUrl,
  ];
>>>>>>> 36164c6f5b45e3db9a6cec0bf761a9596690e1b0
  const result = await db.query(sql, params);
  return result.rows[0].variant_id;
}

// --- READ ---
/**
 * Fetches a product variant by its ID.
 * @param {variantId} - The ID of the product variant to fetch.
 * @returns {variant} - The product variant object.
 */
async function getVariantById(variantId) {
  const sql = `SELECT * FROM get_product_variant_by_id($1);`;
  const result = await db.query(sql, [variantId]);
  return result.rows[0];
}

// --- UPDATE ---
/**
 * Updates a product variant.
 * @param {variantId} - The ID of the product variant to update.
 * @param {variantData} - Object containing imageUrl, color, size, price modifier, and stock quantity.
 * @returns {success} - Whether the update was successful.
 */
async function updateVariant(
  variantId,
<<<<<<< HEAD
  { image_url, color, size, priceModifier, stockQuantity}
) {
  const sql = `SELECT update_product_variant($1, $2, $3, $4, $5, $6) AS success;`;
  const params = [variantId, color, size, stockQuantity, priceModifier,image_url];
=======
  { imageUrl, color, size, priceModifier, stockQuantity}
) {
  const sql = `SELECT update_product_variant($1, $2, $3, $4, $5, $6) AS success;`;
  const params = [variantId, imageUrl, color, size, priceModifier, stockQuantity];
>>>>>>> 36164c6f5b45e3db9a6cec0bf761a9596690e1b0
  const result = await db.query(sql, params);
  return result.rows[0].success;
}

// --- DELETE ---
/**
 * Deletes a product variant by its ID.
 * @param {variantId} - The ID of the product variant to delete.
 * @returns {success} - Whether the deletion was successful.
 */
async function deleteVariant(variantId) {
  const sql = `SELECT delete_product_variant($1) AS success;`;
  const result = await db.query(sql, [variantId]);
  return result.rows[0].success;
}

// --- CUSTOM: Update Stock ---
/**
 * Updates the stock quantity of a product variant.
 * @param {variantId} - The ID of the product variant to update stock.
 * @param {quantityChange} - The quantity to change the stock by (e.g., -2 for decrease, 5 for increase).
 * @returns {newStock} - The new stock quantity after the update.
 */
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

