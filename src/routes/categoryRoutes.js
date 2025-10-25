
const express = require("express");
const router = express.Router();
const {
  createCategoryController,
  getAllCategoriesController,
  updateCategoryController,
  deleteCategoryController,
} = require("../controllers/categoryController");


router.post("/", createCategoryController);


router.get("/", getAllCategoriesController);

router.put("/:id", updateCategoryController);

router.delete("/:id", deleteCategoryController);

module.exports = router;

