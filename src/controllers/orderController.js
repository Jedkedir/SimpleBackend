
const orderService = require("../services/orderService");

exports.createOrderFromCartController = async (req, res) => {
  try {
    const { userId, shippingAddressId, total_amount } = req.body;

    if (!userId || !shippingAddressId || !total_amount) {
      return res
        .status(400)
        .json({
          error: "Missing required checkout details (user ID and addresses).",
        });
    }

    const orderId = await orderService.createOrderFromCart({
      userId,
      shippingAddressId,
      total_amount,
    });
    res.status(201).json({
      message: "Order placed successfully. Proceed to payment.",
      orderId
    });
  } catch (error) {
    console.error("Error creating order from cart:", error.message);
    
    res
      .status(500)
      .json({ error: "Failed to place order", detail: error.message });
  }
};


exports.getOrderByIdController = async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);

    if (isNaN(orderId)) {
      return res.status(400).json({ error: "Invalid order ID format." });
    }

    const order = await orderService.getOrderById(orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order:", error.message);
    res.status(500).json({ error: "Failed to fetch order" });
  }
};


exports.getOrdersByUserIdController = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID format." });
    }

    const orders = await orderService.getOrdersByUserId(userId);
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error.message);
    res.status(500).json({ error: "Failed to fetch user orders" });
  }
};

exports.getOrderHistory = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);


    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID format." });
    }

    const orderHis = await orderService.fetchOrderHistory(userId);
    res.status(200).json({
      message: "order retrieved successfully",
      orderHis
    });
  } catch (error) {
    console.error("Error fetching user orders:", error.message);
    res.status(500).json({ error: "Failed to fetch user orders" });
  }
}

