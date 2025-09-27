const express = require("express");
const router = express.Router();
const {
  createOrderFromCartController,
  getOrderByIdController,
  getOrdersByUserIdController,
} = require("../controllers/orderController");

/**
 * Order API Routes
 * Base Path: /api/orders
 */

router.post("/", createOrderFromCartController); // POST /api/orders (Finalize checkout and create order)
router.get("/:id", getOrderByIdController); // GET /api/orders/:id (Fetch specific order details)
router.get("/user/:userId", getOrdersByUserIdController); // GET /api/orders/user/:userId (Fetch all orders for a user)

module.exports = router;
