/**
 * UserService.js
 * This module contains all database operations related to the User entity.
 * Each function is a wrapper around a PostgreSQL function.
 * @module src/services/userService
 * @description Handles all database operations related to the User entity.
 */
const db = require("../db/pool");
/**
 * Calls the PostgreSQL function to create a new user.
 * @param {Object} userData - Contains firstName, lastName, email, etc., with password_hash.
 * @returns {Number} The newly created user_id.
 * @throws {Error} If the PostgreSQL function throws an error.
 */
async function createUser(userData) {
  /**
   * @typedef {Object} userData
   * @property {string} firstName - The first name of the user.
   * @property {string} lastName - The last name of the user.
   * @property {string} email - The email of the user.
   * @property {string} passwordHash - The hashed password of the user.
   * @property {string} phoneNumber - The phone number of the user.
   * @property {boolean} isAdmin - Whether the user is an administrator.
   */

  const {
    firstName,
    lastName,
    email,
    passwordHash,
    phoneNumber,
    isAdmin = false,
  } = userData;

  const sql = `SELECT create_user($1, $2, $3, $4, $5, $6) AS new_id;`;

  const params = [
    firstName,
    lastName,
    email,
    passwordHash,
    phoneNumber,
    isAdmin,
  ];

  try {
    const result = await db.query(sql, params);
    return result.rows[0].new_id;
  } catch (error) {
    // Re-throw to be handled by controller (e.g., unique constraint violation)
    throw error;
  }
}

/**
 * Calls the PostgreSQL function to retrieve a user by their ID.
 * @param {Number} userId - The ID of the user.
 * @returns {Object} The user object.
 * @throws {Error} If the PostgreSQL function throws an error.
 */
async function getUserById(userId) {
  const sql = `SELECT * FROM get_user_by_id($1);`; // Assumed PG function

  const result = await db.query(sql, [userId]);
  return result.rows[0];
}

/**
 * Calls the PostgreSQL function to retrieve a user by their email.
 * This is used during the login process to check credentials.
 * @param {string} email - The email of the user.
 * @returns {Object | undefined} The user object including the password_hash.
 * @throws {Error} If the PostgreSQL function throws an error.
 */
async function getUserByEmail(email) {
  // We assume a dedicated PG function is created: get_user_by_email(TEXT)
  const sql = `SELECT * FROM get_user_by_email($1);`;

  const result = await db.query(sql, [email]);
  return result.rows[0];
}

/**
 * Calls the PostgreSQL function to update a user's details.
 * @param {Number} userId - The ID of the user.
 * @param {Object} data - Fields to update.
 * @returns {Object} The updated user object.
 * @throws {Error} If the PostgreSQL function throws an error.
 */
async function updateUser(userId, data) {
  const { firstName, lastName, phoneNumber, isAdmin } = data;

  const sql = `SELECT update_user($1, $2, $3, $4, $5);`;

  const params = [userId, firstName, lastName, phoneNumber, isAdmin];

  const result = await db.query(sql, params);
  return result.rows[0];
}

/**
 * Calls the PostgreSQL function to delete a user.
 * @param {Number} userId - The ID of the user.
 * @returns {Boolean} Confirmation of deletion.
 * @throws {Error} If the PostgreSQL function throws an error.
 */
async function deleteUser(userId) {
  const sql = `SELECT delete_user($1);`;

  const result = await db.query(sql, [userId]);
  // PG delete function usually returns the ID of the deleted item or true
  return result.rows.length > 0;
}

module.exports = {
  createUser,
  getUserById,
  getUserByEmail, 
  updateUser,
  deleteUser,
};

