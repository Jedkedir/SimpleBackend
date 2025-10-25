
const express = require("express");
const router = express.Router();

const {
 
  createReviewController,
  getReviewsByProductIdController,
  updateReviewController,
  deleteReviewController,
} = require("../controllers/reviewController");

router.post("/", createReviewController);

router.get("/product/:productId", getReviewsByProductIdController);

router.put("/:id", updateReviewController);

router.delete("/:id", deleteReviewController);

module.exports = router;

