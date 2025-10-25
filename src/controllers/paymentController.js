
const paymentService = require("../services/paymentService");
const db = require("../db/pool");

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
    const sql = `UPDATE orders SET status = 'paid' WHERE order_id = ${orderId}`;
    const result = await db.query(sql);
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

