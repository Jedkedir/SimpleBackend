/**
 * Product Variant API Routes
 * Base Path: /api/variants
 * @description This file contains API routes for Product Variants.
 * @module src/routes/productVariantRoutes
 * @requires express
 * @requires ../controllers/productVariantController
 * @exports router - The express router with Product Variant routes
 */
const express = require("express");
const router = express.Router();

/**
 * @constant {Object} productVariantController
 * @description Object containing all ProductVariant-related controller functions
 * @property {Function} createVariantController - Creates a new variant - Admin
 * @property {Function} getVariantByIdController - Fetches a single variant
 * @property {Function} updateVariantController - Updates variant details
 * @property {Function} deleteVariantController - Deletes variant - Admin
 * @property {Function} updateVariantStockController - Updates stock quantity
 */
const {
  createVariantController,
  getVariantByIdController,
  updateVariantController,
  deleteVariantController,
  updateVariantStockController,
} = require("../controllers/productVariantController");

/**
 * POST /api/variants
 * @description Creates a new variant - Admin
 * @param {req.body} variantData - The variant data to be created
 * @returns {Promise} The created variant ID
 */
router.post("/", createVariantController);

/**
 * GET /api/variants/:id
 * @description Fetches a single variant
 * @param {req.params.id} variantId - The ID of the variant to fetch
 * @returns {Promise} The variant object with the matching ID
 */
router.get("/:id", getVariantByIdController);

/**
 * PUT /api/variants/:id
 * @description Updates variant details
 * @param {req.params.id} variantId - The ID of the variant to update
 * @param {req.body} variantData - The variant data to be updated
 * @returns {Promise} The updated variant ID
 */
router.put("/:id", updateVariantController);

/**
 * DELETE /api/variants/:id
 * @description Deletes variant - Admin
 * @param {req.params.id} variantId - The ID of the variant to delete
 * @returns {Promise} The deleted variant ID
 */
router.delete("/:id", deleteVariantController);

/**
 * PUT /api/variants/:id/stock
 * @description Updates stock quantity
 * @param {req.params.id} variantId - The ID of the variant to update stock for
 * @param {req.body} quantityChange - The quantity to increase or decrease stock by
 * @returns {Promise} The new stock quantity
 */
router.put("/:id/stock", updateVariantStockController);

/**
 * @exports router - The express router with Product Variant routes
 */
module.exports = router;

