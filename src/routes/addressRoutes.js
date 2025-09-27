/**
 * Address API Routes
 * Base Path: /api/addresses
 * @module src/routes/addressRoutes
 */

const express = require("express");
const router = express.Router();
const {
  createAddressController,
  getAddressesByUserIdController,
  updateAddressController,
  deleteAddressController,
} = require("../controllers/addressController");

/**
 * POST /api/addresses
 * Create a new address
 * @param {req.body} addressData - The address data to be created
 * @returns {Promise} The created address ID
 */
router.post("/", createAddressController);

/**
 * GET /api/addresses/user/:userId
 * Fetch all addresses for a user
 * @param {req.params.userId} userId - The user ID of the address owner
 * @returns {Promise.address[]} An array of address objects
 */
router.get("/user/:userId", getAddressesByUserIdController);

/**
 * PUT /api/addresses/:addressId
 * Update a specific address
 * @param {req.params.addressId} addressId - The ID of the address to be updated
 * @param {req.body} addressData - The address data to be updated
 * @returns {Promise} The updated address ID
 */
router.put("/:addressId", updateAddressController);

/**
 * DELETE /api/addresses/:addressId
 * Delete a specific address
 * @param {req.params.addressId} addressId - The ID of the address to be deleted
 * @returns {Promise} The deleted address ID
 */
router.delete("/:addressId", deleteAddressController);

module.exports = router;

