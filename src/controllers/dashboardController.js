const product = require("../services/dashboardService");

const getTotalSoldData = async (req, res) => {
  try {
    // const { userId } = req.body;
    // if (!userId) {
    //   return res.status(400).json({ error: "Missing required user ID." });
    // }
    const data = await product.getTotalSold();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching total sold data:", error.message);
    res.status(500).json({ error: "Failed to fetch total sold data" });
  }
};
const getTotalRevenueData = async (req, res) => {
  try {
    // const { userId } = req.body;
    // if (!userId) {
    //   return res.status(400).json({ error: "Missing required user ID." });
    // }
    const data = await product.getTotalRevenue();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching total revenue data:", error.message);
    res.status(500).json({ error: "Failed to fetch total revenue data" });
  }
};
const getStokeNotificationMessage = async (req, res) => {
  try {
    // const { userId } = req.body;
    // if (!userId) {
    //   return res.status(400).json({ error: "Missing required user ID." });
    // }
    const data = await product.getStokeNotification();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching stoke notification data:", error.message);
    res.status(500).json({ error: "Failed to fetch stoke notification data" });
  }
};
const getOrderNotification = async (req, res) => {
  try {
    // const { userId } = req.body;
    // if (!userId) {
    //   return res.status(400).json({ error: "Missing required user ID." });
    // }
    const data = await product.getOrderNotification();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching stoke notification data:", error.message);
    res.status(500).json({ error: "Failed to fetch stoke notification data" });
  }
};
exports.getUserData = async (req, res) => {
  try {
    // const { userId } = req.body;
    // if (!userId) {
    //   return res.status(400).json({ error: "Missing required user ID." });
    // }
    const totalSoldData = await product.getTotalSold();
    const totalRevenueData = await product.getTotalRevenue();
    const stokeNotificationData = await product.getStockNotification();
    const orderNotificationData = await product.getOrderNotification();

    res.status(200).json({
      totalSoldData,
      totalRevenueData,
      stokeNotificationData,
      orderNotificationData,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error.message);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
};
