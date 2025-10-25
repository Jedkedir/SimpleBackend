
const express = require("express");
const router = express.Router();

const {
  createOrderFromCartController,
  getOrderByIdController,
  getOrdersByUserIdController,
  getOrderHistory
} = require("../controllers/orderController");


router.post("/", createOrderFromCartController);

router.get("/:id", getOrderByIdController);

router.get("/user/:userId", getOrdersByUserIdController);

router.get("/order-history/:userId", getOrderHistory);

module.exports = router;

