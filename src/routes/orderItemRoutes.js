const express = require("express");
const router = express.Router();
const {
  getOrderItemsController,
} = require("../controllers/orderItemController");

/**
 * Order Item API Routes
 * Base Path: /api/order-items
 */

router.get("/:orderId", getOrderItemsController); // GET /api/order-items/:orderId (Fetch items belonging to an order)

module.exports = router;
