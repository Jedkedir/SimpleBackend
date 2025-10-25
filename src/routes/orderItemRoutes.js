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
  createOrderItemsController,
  createOrderItemFromArrayController
} = require("../controllers/orderItemController");


router.get("/:orderId", getOrderItemsController);
router.post("/", createOrderItemsController)
router.post("/from-array", createOrderItemFromArrayController)


module.exports = router;

