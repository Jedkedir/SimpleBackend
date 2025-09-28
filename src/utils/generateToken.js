/**
 * src/utils/generateToken.js
 * Utility function to create and sign a JSON Web Token (JWT).
 */
const jwt = require("jsonwebtoken");

/**
 * Generates a JWT for a given user ID.
 * The token is signed using the JWT_SECRET from the .env file.
 * @param {number} userId - The unique identifier of the user.
 * @returns {string} The signed JWT string.
 */
const generateToken = (userId) => {
  // NOTE: The token payload should contain minimal, non-sensitive data (like user ID).
  // The token is set to expire in 30 days.
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = generateToken;
