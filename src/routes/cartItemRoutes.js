const express = require("express");
const router = express.Router();
const {
  addOrUpdateCartItemController,
  getCartItemsController,
  removeCartItemController,
} = require("../controllers/cartItemController");

/**
 * Cart Item API Routes
 * Base Path: /api/cart-items
 */

router.post("/", addOrUpdateCartItemController); // POST /api/cart-items (Add item or update quantity)
router.get("/:cartId", getCartItemsController); // GET /api/cart-items/:cartId (Fetch items in a specific cart)
router.delete("/:id", removeCartItemController); // DELETE /api/cart-items/:id (Remove item from cart by cart_item_id)

module.exports = router;
