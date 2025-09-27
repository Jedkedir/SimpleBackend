/**
 * Handles all HTTP requests for the User entity.
 *
 * @module src/controllers/userController
 * @description This module contains all controller functions for the User entity.
 */
const userService = require("../services/userService");
// POST /users
/**
 * Creates a new user.
 * @function createUserController
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Response} - Response with either the created user ID or an error message.
 */
exports.createUserController = async (req, res) => {
  try {
    const { firstName, lastName, email, passwordHash, phoneNumber, isAdmin } =
      req.body;

    if (!email || !passwordHash) {
      return res
        .status(400)
        .json({ error: "Missing required fields: email and passwordHash." });
    }

    const userId = await userService.createUser({
      firstName,
      lastName,
      email,
      passwordHash,
      phoneNumber,
      isAdmin,
    });

    res.status(201).json({
      message: "User created successfully",
      userId,
    });
  } catch (error) {
    console.error("Error creating user:", error.message);
    res.status(500).json({ error: "Failed to create user" });
  }
};

// GET /users/:id
/**
 * Fetches a single user by ID.
 * @function getUserByIdController
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Response} - Response with either the user profile or an error message.
 */
exports.getUserByIdController = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID format." });
    }

    const user = await userService.getUserById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error.message);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

// PUT /users/:id
/**
 * Updates a single user by ID.
 * @function updateUserController
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Response} - Response with either a success message or an error message.
 */
exports.updateUserController = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const userData = req.body;

    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID format." });
    }

    const success = await userService.updateUser(userId, userData);

    if (!success) {
      return res
        .status(404)
        .json({ error: "User not found or nothing to update." });
    }

    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error.message);
    res.status(500).json({ error: "Failed to update user" });
  }
};

// DELETE /users/:id
/**
 * Deletes a single user by ID.
 * @function deleteUserController
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Response} - Response with either a success message or an error message.
 */
exports.deleteUserController = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID format." });
    }

    const success = await userService.deleteUser(userId);

    if (!success) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(204).send(); // 204 No Content for successful deletion
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(500).json({ error: "Failed to delete user" });
  }

