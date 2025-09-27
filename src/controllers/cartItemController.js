const cartItemService = require("../services/cartItemService");

/**
 * Handles HTTP requests for Cart Items (adding/updating/removing products in the cart).
 */

// POST /cart-items (Add or Update)
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

// GET /cart-items/:cartId
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

// DELETE /cart-items/:id
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
