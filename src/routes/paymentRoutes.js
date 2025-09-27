/**
 * Payment API Routes
 * Base Path: /api/payments
 * @module src/routes/paymentRoutes
 * @description This file contains API routes for the Payment entity.
 * @requires express
 * @requires ../controllers/paymentController
 * @exports router - The express router with payment routes
 */
const express = require("express");
const router = express.Router();

/**
 * @namespace PaymentController
 * @description Handles all HTTP requests for the Payment entity.
 * @memberof module:src/controllers
 */
const {
  createPaymentController,
  getPaymentsByOrderIdController,
  updatePaymentStatusController,
} = require("../controllers/paymentController");

/**
 * POST /api/payments
 * Records a payment transaction
 * @memberof module:src/routes/paymentRoutes
 * @function createPaymentController
 * @param {Request} req - The Express request object
 * @param {Response} res - The Express response object
 * @returns {Response} - Response with either the payment ID or an error message
 */
router.post("/", createPaymentController);

/**
 * GET /api/payments/order/:orderId
 * Fetches all payments for an order
 * @memberof module:src/routes/paymentRoutes
 * @function getPaymentsByOrderIdController
 * @param {Request} req - The Express request object
 * @param {Response} res - The Express response object
 * @returns {Response} - Response with an array of payment objects or an error message
 */
router.get("/order/:orderId", getPaymentsByOrderIdController);

/**
 * PUT /api/payments/:id/status
 * Update the payment status
 * @memberof module:src/routes/paymentRoutes
 * @function updatePaymentStatusController
 * @param {Request} req - The Express request object
 * @param {Response} res - The Express response object
 * @returns {Response} - Response with either the payment ID or an error message
 */
router.put("/:id/status", updatePaymentStatusController);

/**
 * @exports router - The express router with payment routes
 */
module.exports = router;

