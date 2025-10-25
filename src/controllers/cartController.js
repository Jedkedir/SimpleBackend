
const cartService = require("../services/cartService");

exports.getOrCreateCartController = async (req, res) => {
  try {
    const userId = parseInt(req.body.userId || req.query.userId); 

    if (isNaN(userId)) {
      return res.status(400).json({
        error: "A valid user ID is required.",
      });
    }

    
    let cart = await cartService.getCartByUserId(userId);

    if (!cart) {
      
      const cartId = await cartService.createCart(userId);
      cart = {
        cart_id: cartId,
        user_id: userId,
        created_at: new Date(),
      };
      res.status(201).json({
        message: "New cart created",
        cart,
      });
    } else {
      
      res.status(200).json(cart);
    }
  } catch (error) {
    console.error("Error getting/creating cart:", error.message);
    res.status(500).json({
      error: "Failed to retrieve or create cart",
    });
  }
};


exports.deleteCartController = async (req, res) => {
  try {
    const cartId = parseInt(req.params.id);

    if (isNaN(cartId)) {
      return res.status(400).json({
        error: "Invalid cart ID format.",
      });
    }

    const success = await cartService.deleteCart(cartId); 

    if (!success) {
      return res.status(404).json({
        error: "Cart not found",
      });
    }

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting cart:", error.message);
    res.status(500).json({
      error: "Failed to delete cart",
    });
  }
};

