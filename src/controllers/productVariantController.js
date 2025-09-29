/**
 * Handles all HTTP requests for the Product Variant entity.
 * @module src/controllers/productVariantController
 * @description Handles all HTTP requests for the Product Variant entity.
 */
const productVariantService = require("../services/productVariantService");
/**
 * POST /variants
 * @description Creates a new product variant.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Promise} The created product variant ID.
 */
exports.createVariantController = async (req, res) => {
  try {
<<<<<<< HEAD
    const { productId, color, size, stockQuantity,priceModifier,image_url } = req.body;

    if (!productId || !image_url || !size || stockQuantity === undefined) {
=======
    const { productId, imageUrl, color, size, priceModifier, stockQuantity } = req.body;

    if (!productId || !imageUrl || !size || stockQuantity === undefined) {
>>>>>>> 36164c6f5b45e3db9a6cec0bf761a9596690e1b0
      return res
        .status(400)
        .json({ error: "Missing required variant fields." });
    }

    const variantId = await productVariantService.createVariant({
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
    });

    res.status(201).json({
      message: "Variant created successfully",
      variantId,
    });
  } catch (error) {
    console.error("Error creating variant:", error.message);
    res.status(500).json({ error: "Failed to create variant" });
  }
};

/**
 * GET /variants/:id
 * @description Fetches a single product variant by ID.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Promise} The product variant details object or an error message.
 */
exports.getVariantByIdController = async (req, res) => {
  try {
    const variantId = parseInt(req.params.id);

    if (isNaN(variantId)) {
      return res.status(400).json({ error: "Invalid variant ID format." });
    }

    const variant = await productVariantService.getVariantById(variantId);

    if (!variant) {
      return res.status(404).json({ error: "Variant not found" });
    }

    res.status(200).json(variant);
  } catch (error) {
    console.error("Error fetching variant:", error.message);
    res.status(500).json({ error: "Failed to fetch variant" });
  }
};

/**
 * PUT /variants/:id
 * @description Updates a product variant.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Promise} The updated product variant ID.
 */
exports.updateVariantController = async (req, res) => {
  try {
    const variantId = parseInt(req.params.id);
    const variantData = req.body;

    if (isNaN(variantId)) {
      return res.status(400).json({ error: "Invalid variant ID format." });
    }

    const success = await productVariantService.updateVariant(variantId, variantData);

    if (!success) {
      return res
        .status(404)
        .json({ error: "Variant not found or nothing to update." });
    }

    res.status(200).json({ message: "Variant updated successfully" });
  } catch (error) {
    console.error("Error updating variant:", error.message);
    res.status(500).json({ error: "Failed to update variant" });
  }
};

/**
 * DELETE /variants/:id
 * @description Deletes a product variant by ID.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Promise} The deleted product variant ID.
 */
exports.deleteVariantController = async (req, res) => {
  try {
    const variantId = parseInt(req.params.id);

    if (isNaN(variantId)) {
      return res.status(400).json({ error: "Invalid variant ID format." });
    }

    const success = await productVariantService.deleteVariant(variantId);

    if (!success) {
      return res.status(404).json({ error: "Variant not found" });
    }

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting variant:", error.message);
    res.status(500).json({ error: "Failed to delete variant" });
  }
};

/**
 * PUT /variants/:id/stock
 * @description Updates the stock quantity of a product variant.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Promise} The updated product variant stock quantity.
 */
exports.updateVariantStockController = async (req, res) => {
  try {
    const variantId = parseInt(req.params.id);
    const { quantityChange } = req.body; // e.g., 5 for stock increase, -2 for decrease

    if (
      isNaN(variantId) ||
      quantityChange === undefined ||
      isNaN(quantityChange)
    ) {
      return res
        .status(400)
        .json({ error: "Invalid ID or quantity change value." });
    }

    const newStock = await productVariantService.updateVariantStock(
      variantId,
      quantityChange
    );

    if (newStock === null) {
      return res
        .status(404)
        .json({ error: "Variant not found or stock update failed." });
    }

    res.status(200).json({
      message: "Stock updated successfully",
      newStockQuantity: newStock,
    });
  } catch (error) {
    console.error("Error updating stock:", error.message);
    res.status(500).json({ error: "Failed to update stock" });
  }
};

