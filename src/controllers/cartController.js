const cartService = require("../services/cartService");

/**
 * Handles HTTP requests for the Cart header entity.
 */

// POST /carts (or GET for initialization if one doesn't exist)
exports.getOrCreateCartController = async (req, res) => {
  try {
    const userId = parseInt(req.body.userId || req.query.userId); // Get from body or query

    if (isNaN(userId)) {
      return res.status(400).json({ error: "A valid user ID is required." });
    }

    // Attempt to fetch existing cart
    let cart = await cartService.getCartByUserId(userId);

    if (!cart) {
      // If cart doesn't exist, create a new one
      const cartId = await cartService.createCart(userId);
      cart = { cart_id: cartId, user_id: userId, created_at: new Date() };
      res.status(201).json({ message: "New cart created", cart });
    } else {
      // Return existing cart
      res.status(200).json(cart);
    }
  } catch (error) {
    console.error("Error getting/creating cart:", error.message);
    res.status(500).json({ error: "Failed to retrieve or create cart" });
  }
};

// DELETE /carts/:id
exports.deleteCartController = async (req, res) => {
  try {
    const cartId = parseInt(req.params.id);

    if (isNaN(cartId)) {
      return res.status(400).json({ error: "Invalid cart ID format." });
    }

    const success = await cartService.deleteCart(cartId); // Clears cart items via trigger

    if (!success) {
      return res.status(404).json({ error: "Cart not found" });
    }

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting cart:", error.message);
    res.status(500).json({ error: "Failed to delete cart" });
  }
};
