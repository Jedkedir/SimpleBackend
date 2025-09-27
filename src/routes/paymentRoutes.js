const express = require("express");
const router = express.Router();
const {
  createPaymentController,
  getPaymentsByOrderIdController,
  updatePaymentStatusController,
} = require("../controllers/paymentController");

/**
 * Payment API Routes
 * Base Path: /api/payments
 */

router.post("/", createPaymentController); // POST /api/payments (Record a payment transaction)
router.get("/order/:orderId", getPaymentsByOrderIdController); // GET /api/payments/order/:orderId (Fetch payments for an order)
router.put("/:id/status", updatePaymentStatusController); // PUT /api/payments/:id/status (Update payment status)

module.exports = router;
