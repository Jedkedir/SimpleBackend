const stock = require("../services/stockStatusService");

const getInStockData = async (req, res) => {
  try {
    
    const data = await stock.getInStock();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching InStock data:", error.message);
    res.status(500).json({ error: "Failed to fetch InStock data" });
  }
};
const getOutOfStockData = async (req, res) => {
  try {
    const data = await stock.getOutOfStock();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching Out Of Stock data:", error.message);
    res.status(500).json({ error: "Failed to fetch Out Of Stock data" });
  }
};

exports.getStockData = async (req, res) => {
  try {
    
    const outOfStockData = await stock.getOutOfStock();
    const inStockData = await stock.getInStock();

    res.status(200).json({
      outOfStockData,
      inStockData,
    });
  } catch (error) {
    console.error("Error fetching stock data:", error.message);
    res.status(500).json({ error: "Failed to fetch stock data" });
  }
};
