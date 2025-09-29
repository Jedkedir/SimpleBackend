const product = require("../services/dashboardService");

exports.getTotalSoldData = async (req, res) => {
    try {
        const {userId} = req.body;
        if(!userId){
            return res.status(400).json({error: "Missing required user ID."});
        }
        const data = await product.getTotalSold(userId);
        res.status(200).json(data);

    } catch (error) {
        console.error("Error fetching total sold data:", error.message);
        res.status(500).json({ error: "Failed to fetch total sold data" });
    }
}
exports.getTotalRevenueData = async (req, res) => {
    try {
      const { userId } = req.body;
      if (!userId) {
        return res.status(400).json({ error: "Missing required user ID." });
      }
      const data = await product.getTotalRevenue(userId);
      res.status(200).json(data);
    } catch (error) {
      console.error("Error fetching total revenue data:", error.message);
      res.status(500).json({ error: "Failed to fetch total revenue data" });
    }
}
exports.getStokeNotificationMessage = async (req, res) => {
    try {
      const { userId } = req.body;
      if (!userId) {
        return res.status(400).json({ error: "Missing required user ID." });
      }
      const data = await product.getStokeNotification(userId);
      res.status(200).json(data);
    } catch (error) {
      console.error("Error fetching stoke notification data:", error.message);
      res
        .status(500)
        .json({ error: "Failed to fetch stoke notification data" });
    }
}
exports.getOrderNotification = async (req, res) => {
    try {
      const { userId } = req.body;
      if (!userId) {
        return res.status(400).json({ error: "Missing required user ID." });
      }
      const data = await product.getOrderNotification(userId);
      res.status(200).json(data);
    } catch (error) {
      console.error("Error fetching stoke notification data:", error.message);
      res
        .status(500)
        .json({ error: "Failed to fetch stoke notification data" });
    }
}
