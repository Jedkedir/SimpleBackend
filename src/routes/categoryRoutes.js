const express = require("express");
const router = express.Router();
const {
  createCategoryController,
  getAllCategoriesController,
  updateCategoryController,
  deleteCategoryController,
} = require("../controllers/categoryController");

/**
 * Category API Routes
 * Base Path: /api/categories
 * Note: CRUD for categories is typically admin-only.
 */

router.post("/", createCategoryController); // POST /api/categories (Create a new category)
router.get("/", getAllCategoriesController); // GET /api/categories (Fetch all categories for browsing)
router.put("/:id", updateCategoryController); // PUT /api/categories/:id (Update category details)
router.delete("/:id", deleteCategoryController); // DELETE /api/categories/:id (Delete a category)

module.exports = router;
