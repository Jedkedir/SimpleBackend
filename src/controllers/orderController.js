const orderService = require("../services/orderService");

/**
 * Handles HTTP requests for the Order entity.
 */

// POST /orders (Checkout)
exports.createOrderFromCartController = async (req, res) => {
  try {
    const { userId, shippingAddressId, billingAddressId } = req.body;

    if (!userId || !shippingAddressId || !billingAddressId) {
      return res
        .status(400)
        .json({
          error: "Missing required checkout details (user ID and addresses).",
        });
    }

    const orderId = await orderService.createOrderFromCart({
      userId,
      shippingAddressId,
      billingAddressId,
    });

    res.status(201).json({
      message: "Order placed successfully. Proceed to payment.",
      orderId,
    });
  } catch (error) {
    console.error("Error creating order from cart:", error.message);
    // Look for specific error messages (e.g., empty cart, out of stock) from the service/DB
    res
      .status(500)
      .json({ error: "Failed to place order", detail: error.message });
  }
};

// GET /orders/:id
exports.getOrderByIdController = async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);

    if (isNaN(orderId)) {
      return res.status(400).json({ error: "Invalid order ID format." });
    }

    const order = await orderService.getOrderById(orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order:", error.message);
    res.status(500).json({ error: "Failed to fetch order" });
  }
};

// GET /orders/user/:userId
exports.getOrdersByUserIdController = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID format." });
    }

    const orders = await orderService.getOrdersByUserId(userId);
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error.message);
    res.status(500).json({ error: "Failed to fetch user orders" });
  }
};
