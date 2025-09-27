/**
 * Category API Routes
 * Base Path: /api/categories
 * Note: CRUD for categories is typically admin-only.
 * @module src/routes/categoryRoutes
 * @requires express
 * @requires ../controllers/categoryController
 * @exports router - The express router with category routes
 */
const express = require("express");
const router = express.Router();
const {
  createCategoryController,
  getAllCategoriesController,
  updateCategoryController,
  deleteCategoryController,
} = require("../controllers/categoryController");

/**
 * POST /api/categories
 * Create a new category
 * @memberof module:src/routes/categoryRoutes
 * @function createCategoryController
 * @param {Request} req - The Express request object
 * @param {Response} res - The Express response object
 */
router.post("/", createCategoryController);

/**
 * GET /api/categories
 * Fetch all categories for browsing
 * @memberof module:src/routes/categoryRoutes
 * @function getAllCategoriesController
 * @param {Request} req - The Express request object
 * @param {Response} res - The Express response object
 */
router.get("/", getAllCategoriesController);

/**
 * PUT /api/categories/:id
 * Update category details
 * @memberof module:src/routes/categoryRoutes
 * @function updateCategoryController
 * @param {Request} req - The Express request object
 * @param {Response} res - The Express response object
 */
router.put("/:id", updateCategoryController);

/**
 * DELETE /api/categories/:id
 * Delete a category
 * @memberof module:src/routes/categoryRoutes
 * @function deleteCategoryController
 * @param {Request} req - The Express request object
 * @param {Response} res - The Express response object
 */
router.delete("/:id", deleteCategoryController);

module.exports = router;

