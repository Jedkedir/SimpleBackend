const stock = require("../services/stockStatusService");



exports.getStockData = async (req, res) => {
  try {
    
    let outOfStockData = await stock.getOutOfStock();
    let inStockData = await stock.getInStock();
    console.log(inStockData);
    

    if (!outOfStockData) {
      outOfStockData = null
    }
    if (!inStockData) {
      inStockData = null
    }

    res.status(200).json({
      outOfStockData,
      inStockData,
    });
  } catch (error) {
    console.error("Error fetching stock data:", error.message);
    res.status(500).json({ error: "Failed to fetch stock data" });
  }
};
