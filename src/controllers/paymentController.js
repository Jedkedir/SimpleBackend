/**
 * Handles HTTP requests for the Payment entity.
 *
 * @module src/controllers/paymentController
 * @description Handles HTTP requests for the Payment entity.
 */
const paymentService = require("../services/paymentService");
// POST /payments (Records a payment attempt/success)
/**
 * Handles POST requests to /payments.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Response} - Response with either the created payment ID or an error message.
 */
exports.createPaymentController = async (req, res) => {
  try {
    const { orderId, amount, method, transactionId, status } = req.body;

    if (!orderId || !amount || !method || !transactionId || !status) {
      return res
        .status(400)
        .json({
          error: "Missing required payment fields."
        });
    }

    const paymentId = await paymentService.createPayment({
      orderId,
      amount,
      method,
      transactionId,
      status,
    });

    res.status(201).json({
      message: "Payment record created successfully",
      paymentId,
    });
  } catch (error) {
    console.error("Error creating payment:", error.message);
    res.status(500).json({
      error: "Failed to create payment record"
    });
  }
};

// GET /payments/:orderId
/**
 * Handles GET requests to /payments/:orderId.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Response} - Response with the payment records associated with the order ID.
 */
exports.getPaymentsByOrderIdController = async (req, res) => {
  try {
    const orderId = parseInt(req.params.orderId);

    if (isNaN(orderId)) {
      return res.status(400).json({
        error: "Invalid order ID format."
      });
    }

    const payments = await paymentService.getPaymentsByOrderId(orderId);

    res.status(200).json(payments);
  } catch (error) {
    console.error("Error fetching payments:", error.message);
    res.status(500).json({
      error: "Failed to fetch payments"
    });
  }
};

// PUT /payments/:id/status
/**
 * Handles PUT requests to /payments/:id/status.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Response} - Response with a success message or an error message.
 */
exports.updatePaymentStatusController = async (req, res) => {
  try {
    const paymentId = parseInt(req.params.id);
    const { newStatus } = req.body;

    if (isNaN(paymentId) || !newStatus) {
      return res.status(400).json({
        error: "Invalid ID or missing status."
      });
    }

    const success = await paymentService.updatePaymentStatus(
      paymentId,
      newStatus
    );
    if (!success) {
      return res
        .status(404)
        .json({
          error: "Payment not found or status update failed."
        });
    }

    res.status(200).json({
      message: "Payment status updated successfully"
    });
  } catch (error) {
    console.error("Error updating payment status:", error.message);
    res.status(500).json({
      error: "Failed to update payment status"
    });
  }
};

