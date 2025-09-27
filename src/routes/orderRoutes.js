/**
 * Order API Routes
 * Base Path: /api/orders
 * @module src/routes/orderRoutes
 * @description This file contains API routes for the Order entity.
 */

const express = require("express");
const router = express.Router();

/**
 * @description Controller for finalizing checkout and creating a new order.
 * @function createOrderFromCartController
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Response} - Response with either the created order or an error message.
 */
const {
  createOrderFromCartController,
  getOrderByIdController,
  getOrdersByUserIdController,
} = require("../controllers/orderController");

/**
 * @description Posts a new order (finalizes checkout) and returns the order details.
 * @route POST /api/orders
 * @param {Integer} userId - The user ID the order belongs to.
 * @param {Integer} shippingAddressId - The shipping address ID.
 * @param {Integer} billingAddressId - The billing address ID.
 * @returns {Response} - Response with either the created order or an error message.
 */
router.post("/", createOrderFromCartController);

/**
 * @description Fetches the order details for a specific order ID.
 * @route GET /api/orders/:id
 * @param {Integer} id - The order ID to fetch details for.
 * @returns {Response} - Response with the order details or an error message.
 */
router.get("/:id", getOrderByIdController);

/**
 * @description Fetches all orders for a specific user ID.
 * @route GET /api/orders/user/:userId
 * @param {Integer} userId - The user ID to fetch orders for.
 * @returns {Response} - Response with an array of orders or an error message.
 */
router.get("/user/:userId", getOrdersByUserIdController);

module.exports = router;

