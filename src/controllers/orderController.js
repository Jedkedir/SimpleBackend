/**
 * Handles HTTP requests for the Order entity.
 * @module src/controllers/orderController
 * @description This module provides functions for creating, reading and updating orders.
 */
const orderService = require("../services/orderService");
/**
 * POST /orders (Checkout)
 * Creates a new order from a user's cart.
 * @function createOrderFromCartController
 * @param {Request} req - The Express request object
 * @param {Response} res - The Express response object
 * @returns {Promise<number>} The ID of the newly created order
 */
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

/**
 * GET /orders/:id
 * Fetches the order details for a specific order ID.
 * @function getOrderByIdController
 * @param {Request} req - The Express request object
 * @param {Response} res - The Express response object
 * @returns {Promise<object>} The order details object or an error message
 */
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

/**
 * GET /orders/user/:userId
 * Fetches all orders for a specific user ID.
 * @function getOrdersByUserIdController
 * @param {Request} req - The Express request object
 * @param {Response} res - The Express response object
 * @returns {Promise<object[]>} An array of order details objects or an error message
 */
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

