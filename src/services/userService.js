// src/services/userService.js
const db = require("../db/pool");

/**
 * Calls the PostgreSQL function to create a new user.
 * @param {Object} userData - Contains firstName, lastName, email, etc.
 * @returns {Number} The newly created user_id.
 */
async function createUser(userData) {
  const {
    firstName,
    lastName,
    email,
    passwordHash,
    phoneNumber,
    isAdmin = false,
  } = userData;

  // The SQL call uses SELECT to execute the stored function.
  // $1, $2, ... are placeholders to prevent SQL injection.
  const sql = `SELECT create_user($1, $2, $3, $4, $5, $6) AS new_id;`;

  // The parameters array matches the $ placeholders.
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
    // The return value is in the row under the alias 'new_id'
    return result.rows[0].new_id;
  } catch (error) {
    // Re-throw the error to be handled by the controller
    throw new Error(`DB Error in createUser: ${error.message}`);
  }
}

// Example Read function
async function getUserById(userId) {
  console.log(userId);
  const sql = `SELECT * FROM get_user_by_id($1);`; // Calling the table-returning function
  const result = await db.query(sql, [userId]);
  // The result.rows will contain the user object (or be empty)
  return result.rows[0];
}

module.exports = {
  createUser,
  getUserById,
  // ... other CRUD functions (updateUser, deleteUser)
};
