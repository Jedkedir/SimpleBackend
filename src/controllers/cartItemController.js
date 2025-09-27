/**
 * Handles HTTP requests for Cart Items (adding/updating/removing products in the cart).
 * @module src/controllers/cartItemController
 * @description Handles database operations related to Cart Items.
 */
const cartItemService = require("../services/cartItemService");
/**
 * POST /cart-items (Add or Update)
 * @description Adds or updates a cart item (changes the quantity of a product in the cart).
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Response} - Response with either the updated cart item or an error message.
 */
exports.addOrUpdateCartItemController = async (req, res) => {
  try {
    const { cartId, variantId, quantity } = req.body;

    if (
      !cartId ||
      !variantId ||
      quantity === undefined ||
      isNaN(quantity) ||
      quantity <= 0
    ) {
      return res
        .status(400)
        .json({ error: "Missing or invalid cartId, variantId, or quantity." });
    }

    const cartItemId = await cartItemService.addOrUpdateCartItem({
      cartId,
      variantId,
      quantity,
    });

    res.status(201).json({
      message: "Cart item quantity updated or item added successfully",
      cartItemId,
    });
  } catch (error) {
    console.error("Error adding/updating cart item:", error.message);
    res.status(500).json({ error: "Failed to add/update cart item" });
  }
};

/**
 * GET /cart-items/:cartId
 * @description Fetches all cart items belonging to a specific cart.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Response} - Response with an array of cart items or an error message.
 */
exports.getCartItemsController = async (req, res) => {
  try {
    const cartId = parseInt(req.params.cartId);

    if (isNaN(cartId)) {
      return res.status(400).json({ error: "Invalid cart ID format." });
    }

    const items = await cartItemService.getCartItems(cartId);

    res.status(200).json(items);
  } catch (error) {
    console.error("Error fetching cart items:", error.message);
    res.status(500).json({ error: "Failed to fetch cart items" });
  }
};

/**
 * DELETE /cart-items/:id
 * @description Deletes a cart item by its ID.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Response} - Response with either a success message or an error message.
 */
exports.removeCartItemController = async (req, res) => {
  try {
    const cartItemId = parseInt(req.params.id);

    if (isNaN(cartItemId)) {
      return res.status(400).json({ error: "Invalid cart item ID format." });
    }

    const success = await cartItemService.removeCartItem(cartItemId);

    if (!success) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    res.status(204).send();
  } catch (error) {
    console.error("Error removing cart item:", error.message);
    res.status(500).json({ error: "Failed to remove cart item" });
  }
};

