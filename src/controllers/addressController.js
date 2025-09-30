/**
 * Handles all HTTP requests for the Address entity.
 *
 * Functions:
 * - createAddressController: POST /addresses
 * - getAddressesByUserIdController: GET /addresses/user/:userId
 * - updateAddressController: PUT /addresses/:addressId
 * - deleteAddressController: DELETE /addresses/:addressId
 */
const addressService = require("../services/addressService");
/**
 * --- POST /addresses ---
 * Creates a new address record in the database.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Response} - Response with either the created address ID or an error message.
 */
exports.createAddressController = async (req, res) => {
  try {
    // 1. Extract and validate necessary data from the request body
    const {
      userId,
      street,
      street_2,
      city,
      state,
      postalCode,
      country,
      
    } = req.body;

    // Basic validation check
    if (!userId || !street || !city || !postalCode || !country) {
      return res.status(400).json({
        error:
          "Missing required address fields: userId, addressLine1, city, postalCode, and country.",
      });
    }

    // 2. Call the service layer function
    const addressId = await addressService.createAddress({
      userId,
      street,
      street_2, 
      city,
      state,
      postalCode, 
      country,
    });

    // 3. Send successful response
    res.status(201).json({
      message: "Address created successfully",
      addressId,
    });
  } catch (error) {
    console.error("Error creating address:", error.message);
    res.status(500).json({ error: "Failed to create address" });
  }
};

/**
 * --- GET /addresses/user/:userId ---
 * Retrieves all addresses of a specific user from the database.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Response} - Response with either the addresses or an error message.
 */
exports.getAddressesByUserIdController = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID format." });
    }

    // Call the service layer function
    const addresses = await addressService.getAddressesByUserId(userId);

    res.status(200).json(addresses);
  } catch (error) {
    console.error("Error fetching addresses:", error.message);
    res.status(500).json({ error: "Failed to fetch addresses" });
  }
};

/**
 * --- PUT /addresses/:addressId ---
 * Updates an existing address record in the database.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Response} - Response with either a success message or an error message.
 */
exports.updateAddressController = async (req, res) => {
  try {
    const addressId = parseInt(req.params.addressId);
    const addressData = req.body; // Pass all relevant fields from the body

    if (isNaN(addressId)) {
      return res.status(400).json({ error: "Invalid address ID format." });
    }

    // Call the service layer function
    const success = await addressService.updateAddress(addressId, addressData);

    if (!success) {
      // If the update stored procedure returns false, it means the ID was not found
      return res
        .status(404)
        .json({ error: "Address not found or nothing to update." });
    }

    res.status(200).json({ message: "Address updated successfully" });
  } catch (error) {
    console.error("Error updating address:", error.message);
    res.status(500).json({ error: "Failed to update address" });
  }
};

/**
 * --- DELETE /addresses/:addressId ---
 * Deletes an existing address record from the database.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Response} - Response with either a success message or an error message.
 */
exports.deleteAddressController = async (req, res) => {
  try {
    const addressId = parseInt(req.params.addressId);

    if (isNaN(addressId)) {
      return res.status(400).json({ error: "Invalid address ID format." });
    }

    // Call the service layer function
    const success = await addressService.deleteAddress(addressId);

    if (!success) {
      return res.status(404).json({ error: "Address not found" });
    }

    res.status(204).send(); // 204 No Content for successful deletion
  } catch (error) {
    console.error("Error deleting address:", error.message);
    res.status(500).json({ error: "Failed to delete address" });
  }
};

