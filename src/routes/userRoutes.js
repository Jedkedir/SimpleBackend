
const express = require("express");
const router = express.Router();


const {
  createUserController,
  getUserByIdController,
  updateUserController,
  deleteUserController,
} = require("../controllers/userController");


router.post("/", createUserController);


router.get("/:id", getUserByIdController);

router.put("/:id", updateUserController);

router.delete("/:id", deleteUserController);

router.get("/profile", getUserByIdController); 

module.exports = router;

