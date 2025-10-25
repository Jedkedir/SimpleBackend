
const express = require("express");
const router = express.Router();
const {
  createAddressController,
  getAddressesByUserIdController,
  updateAddressController,
  deleteAddressController,
} = require("../controllers/addressController");


router.post("/", createAddressController);

router.get("/user/:userId", getAddressesByUserIdController);

router.put("/:addressId", updateAddressController);

router.delete("/:addressId", deleteAddressController);

module.exports = router;

