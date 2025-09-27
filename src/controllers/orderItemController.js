const orderItemService = require("../services/orderItemService");

/**
 * Handles HTTP requests for Order Items. Primarily used for viewing order details.
 */

// GET /order-items/:orderId
exports.getOrderItemsController = async (req, res) => {
  try {
    const orderId = parseInt(req.params.orderId);

    if (isNaN(orderId)) {
      return res.status(400).json({ error: "Invalid order ID format." });
    }

    const items = await orderItemService.getOrderItems(orderId);

    res.status(200).json(items);
  } catch (error) {
    console.error("Error fetching order items:", error.message);
    res.status(500).json({ error: "Failed to fetch order items" });
  }
};
