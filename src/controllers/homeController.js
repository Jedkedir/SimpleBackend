const home = require("../services/homeService");

exports.getHomeData = async (req, res) => {
  try {
    const bestSellingData = await home.getBestSelling();
    const featuresData = await home.getFeatures();
    res.status(200).json({
      bestSellingData,
      featuresData,
    });
  } catch (error) {
    console.error("Error fetching home data:", error.message);
    res.status(500).json({ error: "Failed to fetch home data" });
  }
};
