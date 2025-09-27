/**
 * Handles all HTTP requests for the Category entity (admin-focused).
 * @module src/controllers/categoryController
 * @description Handles creation, reading, updating, and deletion of categories in the database.
 */
const categoryService = require("../services/categoryService");
/**
 * @function createCategoryController
 * @description Creates a new category in the database.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Response} - Response with either the created category ID or an error message.
 */
exports.createCategoryController = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Category name is required." });
    }

    const categoryId = await categoryService.createCategory({
      name,
      description,
    });

    res.status(201).json({
      message: "Category created successfully",
      categoryId,
    });
  } catch (error) {
    console.error("Error creating category:", error.message);
    res.status(500).json({ error: "Failed to create category" });
  }
};

/**
 * @function getAllCategoriesController
 * @description Retrieves all categories from the database.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Response} - Response with either the array of categories or an error message.
 */
exports.getAllCategoriesController = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error.message);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

/**
 * @function updateCategoryController
 * @description Updates a category in the database.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Response} - Response with either the updated category or an error message.
 */
exports.updateCategoryController = async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);
    const { name, description } = req.body;

    if (isNaN(categoryId) || !name) {
      return res
        .status(400)
        .json({ error: "Invalid ID or missing category name." });
    }

    const success = await categoryService.updateCategory(categoryId, {
      name,
      description,
    });

    if (!success) {
      return res
        .status(404)
        .json({ error: "Category not found or nothing to update." });
    }

    res.status(200).json({ message: "Category updated successfully" });
  } catch (error) {
    console.error("Error updating category:", error.message);
    res.status(500).json({ error: "Failed to update category" });
  }
};

/**
 * @function deleteCategoryController
 * @description Deletes a category from the database.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Response} - Response with either a success message or an error message.
 */
exports.deleteCategoryController = async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);

    if (isNaN(categoryId)) {
      return res.status(400).json({ error: "Invalid category ID format." });
    }

    const success = await categoryService.deleteCategory(categoryId);

    if (!success) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting category:", error.message);
    res.status(500).json({ error: "Failed to delete category" });
  }
};

