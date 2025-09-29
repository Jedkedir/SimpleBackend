/**
 * Order Item API Routes
 * Base Path: /api/order-items
 * @module src/routes/orderItemRoutes
 * @description This file contains API routes for Order Items.
 * @requires express
 * @requires ../controllers/orderItemController
 * @exports router - The express router with Order Item routes
 */

const express = require("express");
const router = express.Router();
const {
  getOrderItemsController,
  createOrderItemsController
} = require("../controllers/orderItemController");

/**
 * GET /api/order-items/:orderId
 * Fetches all order items belonging to an order
 * @param {Integer} orderId - The ID of the order to fetch items for
 * @returns {Response} - Response with an array of order items or an error message
 */
router.get("/:orderId", getOrderItemsController);
router.post("/", createOrderItemsController);
/**
 * @exports router - The express router with Order Item routes
 */
module.exports = router;

