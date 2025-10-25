const express = require("express");
const router = express.Router();


const {
  createProductController,
  getProductByIdController,
  updateProductController,
  deleteProductController,
  getAllProductsController,
  getProductByCategory,
} = require("../controllers/productController");

router.get("/get-all", getAllProductsController);


router.post("/", createProductController);


router.get("/:id", getProductByIdController);


router.post("/get-by-cat", getProductByCategory);



router.put("/:id", updateProductController);

router.delete("/:id", deleteProductController);

module.exports = router;

