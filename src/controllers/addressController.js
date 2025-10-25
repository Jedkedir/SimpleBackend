
const addressService = require("../services/addressService");

exports.createAddressController = async (req, res) => {
  try {
    
    const {
      userId,
      street,
      street_2,
      city,
      state,
      postalCode,
      country,
      
    } = req.body;

    
    if (!userId || !street || !city || !postalCode || !country) {
      return res.status(400).json({
        error:
          "Missing required address fields: userId, addressLine1, city, postalCode, and country.",
      });
    }

    
    const addressId = await addressService.createAddress({
      userId,
      street,
      street_2, 
      city,
      state,
      postalCode, 
      country,
    });

    
    res.status(201).json({
      message: "Address created successfully",
      addressId,
    });
  } catch (error) {
    console.error("Error creating address:", error.message);
    res.status(500).json({ error: "Failed to create address" });
  }
};


exports.getAddressesByUserIdController = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID format." });
    }

    
    const addresses = await addressService.getAddressesByUserId(userId);

    res.status(200).json(addresses);
  } catch (error) {
    console.error("Error fetching addresses:", error.message);
    res.status(500).json({ error: "Failed to fetch addresses" });
  }
};


exports.updateAddressController = async (req, res) => {
  try {
    const addressId = parseInt(req.params.addressId);
    const addressData = req.body; 

    if (isNaN(addressId)) {
      return res.status(400).json({ error: "Invalid address ID format." });
    }

    
    const success = await addressService.updateAddress(addressId, addressData);

    if (!success) {
      
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

exports.deleteAddressController = async (req, res) => {
  try {
    const addressId = parseInt(req.params.addressId);

    if (isNaN(addressId)) {
      return res.status(400).json({ error: "Invalid address ID format." });
    }

    
    const success = await addressService.deleteAddress(addressId);

    if (!success) {
      return res.status(404).json({ error: "Address not found" });
    }

    res.status(204).send(); 
  } catch (error) {
    console.error("Error deleting address:", error.message);
    res.status(500).json({ error: "Failed to delete address" });
  }
};

