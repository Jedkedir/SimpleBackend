const express = require("express");
const router = express.Router();
const {
  createProductController,
  getProductByIdController,
  updateProductController,
  deleteProductController,
} = require("../controllers/productController");

/**
 * Product API Routes
 * Base Path: /api/products
 */

router.post("/", createProductController); // POST /api/products (Create a new product - Admin)
router.get("/:id", getProductByIdController); // GET /api/products/:id (Fetch a single product)
// You might add a GET /products for fetching a list of products (e.g., search/filter)
router.put("/:id", updateProductController); // PUT /api/products/:id (Update product details)
router.delete("/:id", deleteProductController); // DELETE /api/products/:id (Delete product - Admin)

module.exports = router;
