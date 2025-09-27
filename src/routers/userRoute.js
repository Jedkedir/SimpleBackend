// src/routes/userRoutes.js
const express = require("express");
const { createUserController } = require("../controllers/userController");

const router = express.Router();

// Maps POST request to the controller function
router.post("/", createUserController);

module.exports = router;
