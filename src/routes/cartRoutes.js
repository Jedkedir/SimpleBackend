const express = require("express");
const router = express.Router();
const {
  getOrCreateCartController,
  deleteCartController,
} = require("../controllers/cartController");

/**
 * Cart API Routes
 * Base Path: /api/carts
 */

router.post("/", getOrCreateCartController); // POST /api/carts (Gets cart by userId or creates a new one)
router.delete("/:id", deleteCartController); // DELETE /api/carts/:id (Empty/delete the entire cart)

module.exports = router;
