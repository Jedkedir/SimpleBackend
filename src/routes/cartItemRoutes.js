/**
 * Cart Item API Routes
 * Base Path: /api/cart-items
 * @description This file contains API routes for Cart Items.
 * @module src/routes/cartItemRoutes
 */

const express = require("express");
const router = express.Router();

/**
 * @description Controller for adding or updating a cart item.
 * @function addOrUpdateCartItemController
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Response} - Response with either the updated cart item or an error message.
 */
const {
  addOrUpdateCartItemController,
  getCartItemsController,
  removeCartItemController,
} = require("../controllers/cartItemController");

/**
 * @description Posts a new cart item or updates the quantity of an existing one.
 * @route POST /cart-items
 * @param {Integer} userId - The user ID the cart belongs to.
 * @param {Integer} variantId - The variant ID of the product being added.
 * @param {Integer} quantity - The quantity of the product being added.
 * @returns {Response} - Response with either the updated cart item or an error message.
 */
router.post("/", addOrUpdateCartItemController);  

/**
 * @description Fetches all cart items belonging to a specific cart.
 * @route GET /cart-items/:cartId
 * @param {Integer} cartId - The cart ID to fetch items for.
 * @returns {Response} - Response with an array of cart items or an error message.
 */
router.get("/:userId", getCartItemsController);

/**
 * @description Deletes a cart item by its ID.
 * @route DELETE /cart-items/:id
 * @param {Integer} id - The cart item ID to delete.
 * @returns {Response} - Response with either a success message or an error message.
 */
router.delete("/:id", removeCartItemController);

module.exports = router;

