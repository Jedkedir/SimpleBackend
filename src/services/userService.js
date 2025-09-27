// src/services/userService.js
const db = require("../db/pool");

async function createUser(userData) {
  const {
    firstName,
    lastName,
    email,
    passwordHash,
    phoneNumber,
    isAdmin = false,
  } = userData;

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
    return result.rows[0].new_id;
  } catch (error) {
    throw new Error(`DB Error in createUser: ${error.message}`);
  }
}

async function getUserById(userId) {
  console.log(userId);
  const sql = `SELECT * FROM get_user_by_id($1);`;
  const result = await db.query(sql, [userId]);
  return result.rows[0];
}

module.exports = {
  createUser,
  getUserById,
};
