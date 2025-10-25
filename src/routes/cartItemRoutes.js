
const express = require("express");
const router = express.Router();


const {
  addOrUpdateCartItemController,
  getCartItemsController,
  removeCartItemController,
  updateCartItemQuantityController
} = require("../controllers/cartItemController");


router.post("/", addOrUpdateCartItemController);  


router.get("/:userId", getCartItemsController);

router.put("/", updateCartItemQuantityController);

router.delete("/:id", removeCartItemController);

module.exports = router;

