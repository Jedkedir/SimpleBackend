const db = require("../db/pool");

/**
 * Service module for all Address-related database operations.
 */

// --- CREATE ---
async function createAddress({
  userId,
  street,
  city,
  state,
  zipCode,
  country,
  isDefault = false,
}) {
  const sql = `SELECT create_address($1, $2, $3, $4, $5, $6, $7) AS address_id;`;
  const params = [userId, street, city, state, zipCode, country, isDefault];
  const result = await db.query(sql, params);
  return result.rows[0].address_id;
}

// --- READ ---
async function getAddressesByUserId(userId) {
  const sql = `SELECT * FROM get_addresses_by_user_id($1);`;
  const result = await db.query(sql, [userId]);
  return result.rows;
}

// --- UPDATE ---
async function updateAddress(
  addressId,
  { street, city, state, zipCode, country, isDefault }
) {
  const sql = `SELECT update_address($1, $2, $3, $4, $5, $6, $7) AS success;`;
  const params = [addressId, street, city, state, zipCode, country, isDefault];
  const result = await db.query(sql, params);
  return result.rows[0].success;
}

// --- DELETE ---
async function deleteAddress(addressId) {
  const sql = `SELECT delete_address($1) AS success;`;
  const result = await db.query(sql, [addressId]);
  return result.rows[0].success;
}

module.exports = {
  createAddress,
  getAddressesByUserId,
  updateAddress,
  deleteAddress,
};
