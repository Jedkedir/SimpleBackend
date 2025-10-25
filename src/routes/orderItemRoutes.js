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

