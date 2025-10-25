
const express = require("express");
const router = express.Router();


const {
  createVariantController,
  getVariantByIdController,
  updateVariantController,
  deleteVariantController,
  updateVariantStockController,
} = require("../controllers/productVariantController");


router.post("/", createVariantController);

router.get("/:id", getVariantByIdController);

router.put("/:id", updateVariantController);

router.delete("/:id", deleteVariantController);

router.put("/:id/stock", updateVariantStockController);

module.exports = router;

