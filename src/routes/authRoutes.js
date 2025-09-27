/**
 * Authentication API Routes
 * Base Path: /api/auth
 * @module src/routes/authRoutes
 * @requires express
 * @requires ../controllers/authController
 * @exports router - The express router with authentication routes
 */
const express = require('express');
const router = express.Router();
const {
  registerController,
  loginController,
} = require('../controllers/authController');

/**
 * Registers a new user and returns a JWT.
 * @memberof module:src/routes/authRoutes
 * @function registerController
 * @param {Request} req - The Express request object
 * @param {Response} res - The Express response object
 */
router.post('/register', registerController);

/**
 * Authenticates a user and returns a JWT.
 * @memberof module:src/routes/authRoutes
 * @function loginController
 * @param {Request} req - The Express request object
 * @param {Response} res - The Express response object
 */
router.post('/login', loginController);

module.exports = router;

