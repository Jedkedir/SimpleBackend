/**
 * Product API Routes
 * Base Path: /api/products
 * 
 * This file contains API routes for the Product entity.
 * 
 * @module src/routes/productRoutes
 * @requires express
 * @requires ../controllers/productController
 * @exports router - The express router with product routes
 */
const express = require("express");
const router = express.Router();

/**
 * @description Controller for creating a new product.
 * @function createProductController
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Response} - Response with either the created product or an error message.
 */
const {
  createProductController,
  getProductByIdController,
  updateProductController,
  deleteProductController,
  getAllProductsController,
} = require("../controllers/productController");

router.get("/get-all", getAllProductsController);

/**
 * @description Creates a new product.
 * @route POST /api/products
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Response} - Response with either the created product or an error message.
 */
router.post("/", createProductController);

/**
 * @description Fetches a single product by ID.
 * @route GET /api/products/:id
 * @param {Integer} id - The product ID to fetch.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Response} - Response with either the product or an error message.
 */
router.get("/:id", getProductByIdController);


/**
 * @description Updates a product by ID.
 * @route PUT /api/products/:id
 * @param {Integer} id - The product ID to update.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Response} - Response with either the updated product or an error message.
 */
router.put("/:id", updateProductController);

/**
 * @description Deletes a product by ID.
 * @route DELETE /api/products/:id
 * @param {Integer} id - The product ID to delete.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Response} - Response with either a success message or an error message.
 */
router.delete("/:id", deleteProductController);

module.exports = router;

