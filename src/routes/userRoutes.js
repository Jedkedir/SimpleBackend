const express = require("express");
const router = express.Router();
const {
  createUserController,
  getUserByIdController,
  updateUserController,
  deleteUserController,
} = require("../controllers/userController");

/**
 * User API Routes
 * Base Path: /api/users
 */

router.post("/", createUserController); // POST /api/users (Create a new user/register)
router.get("/:id", getUserByIdController); // GET /api/users/:id (Fetch user profile)
router.put("/:id", updateUserController); // PUT /api/users/:id (Update user profile)
router.delete("/:id", deleteUserController); // DELETE /api/users/:id (Delete user account)

module.exports = router;
