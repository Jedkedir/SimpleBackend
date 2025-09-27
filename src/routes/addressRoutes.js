const express = require("express");
const router = express.Router();
const {
  createAddressController,
  getAddressesByUserIdController,
  updateAddressController,
  deleteAddressController,
} = require("../controllers/addressController");

/**
 * Address API Routes
 * Base Path: /api/addresses
 */

router.post("/", createAddressController); // POST /api/addresses (Add a new address)
router.get("/user/:userId", getAddressesByUserIdController); // GET /api/addresses/user/:userId (Fetch all addresses for a user)
router.put("/:addressId", updateAddressController); // PUT /api/addresses/:addressId (Update a specific address)
router.delete("/:addressId", deleteAddressController); // DELETE /api/addresses/:addressId (Delete a specific address)

module.exports = router;
