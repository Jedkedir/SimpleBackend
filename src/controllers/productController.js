const productService = require("../services/productService");

/**
 * Handles all HTTP requests for the Product entity.
 */

// POST /products
exports.createProductController = async (req, res) => {
  try {
    const { categoryId, name, description, basePrice } = req.body;

    if (!categoryId || !name || !basePrice) {
      return res
        .status(400)
        .json({ error: "Missing required product fields." });
    }

    const productId = await productService.createProduct({
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

// GET /products/:id
exports.getProductByIdController = async (req, res) => {
  try {
    const productId = parseInt(req.params.id);

    if (isNaN(productId)) {
      return res.status(400).json({ error: "Invalid product ID format." });
    }

    const product = await productService.getProductById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error.message);
    res.status(500).json({ error: "Failed to fetch product" });
  }
};

// PUT /products/:id
exports.updateProductController = async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const productData = req.body;

    if (isNaN(productId)) {
      return res.status(400).json({ error: "Invalid product ID format." });
    }

    const success = await productService.updateProduct(productId, productData);

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

// DELETE /products/:id
exports.deleteProductController = async (req, res) => {
  try {
    const productId = parseInt(req.params.id);

    if (isNaN(productId)) {
      return res.status(400).json({ error: "Invalid product ID format." });
    }

    const success = await productService.deleteProduct(productId);

    if (!success) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting product:", error.message);
    res.status(500).json({ error: "Failed to delete product" });
  }
};
