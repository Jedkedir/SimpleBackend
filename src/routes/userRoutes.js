/**
 * User API Routes
 * Base Path: /api/users
 * @module src/routes/userRoutes
 * @description This file contains API routes for the User entity.
 */

const express = require("express");
const router = express.Router();

/**
 * @namespace UserController
 * @description Handles all HTTP requests for the User entity.
 * @memberof module:src/controllers
 */
const {
  createUserController,
  getUserByIdController,
  updateUserController,
  deleteUserController,
} = require("../controllers/userController");

/**
 * @description Creates a new user (registration).
 * @function createUserController
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Response} - Response with either the created user ID or an error message.
 */
router.post("/", createUserController);

/**
 * @description Fetches the user profile for a specific user ID.
 * @function getUserByIdController
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Response} - Response with the user profile or an error message.
 */
router.get("/:id", getUserByIdController);

/**
 * @description Updates the user profile for a specific user ID.
 * @function updateUserController
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Response} - Response with either the updated user ID or an error message.
 */
router.put("/:id", updateUserController);

/**
 * @description Deletes the user account for a specific user ID.
 * @function deleteUserController
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Response} - Response with either the deleted user ID or an error message.
 */
router.delete("/:id", deleteUserController);

/**
 * @description Returns the profile of the currently authenticated user.
 */
router.get("/profile", getUserByIdController); 

/**
 * @exports router - The express router with user routes
 */
module.exports = router;

