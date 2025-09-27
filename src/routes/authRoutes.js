const express = require("express");
const router = express.Router();
const {
  registerController,
  loginController,
} = require("../controllers/authController");

/**
 * Authentication API Routes
 * Base Path: /api/auth
 */

router.post("/register", registerController); // POST /api/auth/register
router.post("/login", loginController); // POST /api/auth/login

module.exports = router;
