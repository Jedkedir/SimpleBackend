const express = require("express");
const router = express.Router();
const {
  createVariantController,
  getVariantByIdController,
  updateVariantController,
  deleteVariantController,
  updateVariantStockController,
} = require("../controllers/productVariantController");

/**
 * Product Variant API Routes
 * Base Path: /api/variants
 */

router.post("/", createVariantController); // POST /api/variants (Create a new variant - Admin)
router.get("/:id", getVariantByIdController); // GET /api/variants/:id (Fetch a single variant)
router.put("/:id", updateVariantController); // PUT /api/variants/:id (Update variant details)
router.delete("/:id", deleteVariantController); // DELETE /api/variants/:id (Delete variant - Admin)

router.put("/:id/stock", updateVariantStockController); // PUT /api/variants/:id/stock (Update stock quantity)

module.exports = router;
