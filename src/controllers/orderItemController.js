/**
 * Handles HTTP requests for Order Items. Primarily used for viewing order details.
 * @module src/controllers/orderItemController
 * @description This module provides functions for creating, reading and updating order items.
 * @requires ../services/orderItemService
 */
const orderItemService = require("../services/orderItemService");
/**
 * GET /order-items/:orderId
 * Fetches all order items belonging to an order.
 * @function getOrderItemsController
 * @param {Request} req - The Express request object
 * @param {Response} res - The Express response object
 * @returns {Promise<object[]>} An array of objects containing order item information.
 */
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

