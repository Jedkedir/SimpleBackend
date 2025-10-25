
const express = require("express");
const router = express.Router();


const {
  createPaymentController,
  getPaymentsByOrderIdController,
  updatePaymentStatusController,
} = require("../controllers/paymentController");

router.post("/", createPaymentController);

router.get("/order/:orderId", getPaymentsByOrderIdController);


router.put("/:id/status", updatePaymentStatusController);


module.exports = router;

