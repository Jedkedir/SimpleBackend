

const express = require("express");
const router = express.Router();


const {
  getOrCreateCartController,
  deleteCartController,
} = require("../controllers/cartController");


router.post("/", getOrCreateCartController);


router.delete("/:id", deleteCartController);

module.exports = router;

