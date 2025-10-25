const product = require("../services/dashboardService");

exports.getUserData = async (req, res) => {
  try {
    const totalSoldData = await product.getTotalSold();
    const totalRevenueData = await product.getTotalRevenue();
    const stokeNotificationData = await product.getStockNotification();
    const orderNotificationData = await product.getOrderNotification();
    const topSellingData = await product.getTopSelling();

    res.status(200).json({
      totalSoldData,
      totalRevenueData,
      stokeNotificationData,
      orderNotificationData,
      topSellingData
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error.message);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
};
