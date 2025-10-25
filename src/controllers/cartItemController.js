
const cartItemService = require("../services/cartItemService");

exports.addOrUpdateCartItemController = async (req, res) => {
  try {
    // Extract userId, variantId, and quantity from the request body
    const { userId, variantId, quantity } = req.body;
    console.log(req.body)
    if (
      !userId ||
      !variantId ||
      quantity === undefined ||
      isNaN(quantity) ||
      quantity <= 0
    ) {
      return res
        .status(400)
        .json({ error: "Missing or invalid userId, variantId, or quantity." });
    }

    const cartItemId = await cartItemService.addOrUpdateCartItem({
      userId,
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


exports.getCartItemsController = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid cart ID format." });
    }

    const items = await cartItemService.getCartItems(userId);

    res.status(200).json({
      cartItems: items
    });
  } catch (error) {
    console.error("Error fetching cart items:", error.message);
    res.status(500).json({ error: "Failed to fetch cart items" });
  }
};


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

    res.status(200).json({message: success});
  } catch (error) {
    console.error("Error removing cart item:", error.message);
    res.status(500).json({ error: "Failed to remove cart item" });
  }
};

exports.updateCartItemQuantityController = async (req, res) => {
  try {
    const { cart_item_id, quantity } = req.body;
   
    const success = await cartItemService.updateCartItemQuantity(
      cart_item_id,
      quantity
    );
    if (!success) {
      return res.status(404).json({ error: "Cart item not found" });
    }
    res.status(200).json({message: success});
  } catch (error) {
    console.error("Error updating cart item quantity:", error.message);
    res.status(500).json({ error: "Failed to update cart item quantity" });
  }
};

