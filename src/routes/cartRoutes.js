/**
 * Cart API Routes
 * Base Path: /api/carts
 * @module src/routes/cartRoutes
 * @description This file contains API routes for the Cart entity.
 */

const express = require("express");
const router = express.Router();

/**
 * @description Controller for getting a cart by user ID or creating a new one.
 * @function getOrCreateCartController
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Response} - Response with either the created/updated cart or an error message.
 */
const {
  getOrCreateCartController,
  deleteCartController,
} = require("../controllers/cartController");

/**
 * @description Gets a cart by user ID or creates a new one.
 * @route POST /api/carts
 * @param {Integer} userId - The user ID the cart belongs to.
 * @returns {Response} - Response with either the created/updated cart or an error message.
 */
router.post("/", getOrCreateCartController);

/**
 * @description Deletes a cart by its ID.
 * @route DELETE /api/carts/:id
 * @param {Integer} id - The cart ID to delete.
 * @returns {Response} - Response with either a success message or an error message.
 */
router.delete("/:id", deleteCartController);

module.exports = router;

