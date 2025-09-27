const categoryService = require("../services/categoryService");

/**
 * Handles all HTTP requests for the Category entity (admin-focused).
 */

// POST /categories
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

// GET /categories
exports.getAllCategoriesController = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error.message);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

// PUT /categories/:id
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

// DELETE /categories/:id
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
