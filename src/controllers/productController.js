/**
 * Handles all HTTP requests for the Product entity.
 * @module src/controllers/productController
 * @description This module contains all controller functions for the Product entity.
 */
const product = require("../services/productService");
/**
 * POST /products
 * @function createProductController
 * @description Creates a new product.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Promise} The created product ID.
 */
exports.createProductController = async (req, res) => {
  try {

    const { categoryId, name, description, basePrice } = req.body;
    console.log(req.body);
    if (!categoryId || !name || !basePrice) {
      return res
        .status(400)
        .json({ error: "Missing required product fields." });
    }

    const productId = await product.createProduct({
      categoryId,
      name,
      description,
      basePrice,
    });

    res.status(201).json({
      message: "Product created successfully",
      productId,
    });
  } catch (error) {
    console.error("Error creating product:", error.message);
    res.status(500).json({ error: "Failed to create product" });
  }
};

/**
 * GET /products/:id
 * @function getProductByIdController
 * @description Fetches a single product by ID.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Promise} The product details object or an error message.
 */
exports.getProductByIdController = async (req, res) => {
  try {
    const productId = parseInt(req.params.id);

    if (isNaN(productId)) {
      return res.status(400).json({ error: "Invalid product ID format." });
    }

    const product = await product.getProductById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error.message);
    res.status(500).json({ error: "Failed to fetch product" });
  }
};

/**
 * PUT /products/:id
 * @function updateProductController
 * @description Updates a product by ID.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Promise} Success or error message.
 */
exports.updateProductController = async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const productData = req.body;

    if (isNaN(productId)) {
      return res.status(400).json({ error: "Invalid product ID format." });
    }

    const success = await product.updateProduct(productId, productData);

    if (!success) {
      return res
        .status(404)
        .json({ error: "Product not found or nothing to update." });
    }

    res.status(200).json({ message: "Product updated successfully" });
  } catch (error) {
    console.error("Error updating product:", error.message);
    res.status(500).json({ error: "Failed to update product" });
  }
};

/**
 * DELETE /products/:id
 * @function deleteProductController
 * @description Deletes a product by ID.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Promise} Success or error message.
 */
exports.deleteProductController = async (req, res) => {
  try {
    const productId = parseInt(req.params.id);

    if (isNaN(productId)) {
      return res.status(400).json({ error: "Invalid product ID format." });
    }

    const success = await product.deleteProduct(productId);

    if (!success) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting product:", error.message);
    res.status(500).json({ error: "Failed to delete product" });
  }
};

