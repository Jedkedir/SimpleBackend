/**
 * Service module for all Address-related database operations.
 *
 * @module src/services/addressService
 */
const db = require("../db/pool");
/**
 * --- CREATE ---
 * Creates a new address record in the database.
 * @param {number} userId - The user ID of the address owner.
 * @param {string} street - The address street.
 * @param {string} city - The address city.
 * @param {string} state - The address state.
 * @param {string} zipCode - The address zip code.
 * @param {string} country - The address country.
 * @param {boolean} isDefault - Whether this address is the default address of the user.
 * @returns {Promise<number>} The ID of the newly created address.
 */
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

/**
 * --- READ ---
 * Retrieves all addresses of a specific user from the database.
 * @param {number} userId - The user ID of the address owner.
 * @returns {Promise.address[]} An array of address objects.
 */
async function getAddressesByUserId(userId) {
  const sql = `SELECT * FROM get_addresses_by_user_id($1);`;
  const result = await db.query(sql, [userId]);
  return result.rows;
}

/**
 * --- UPDATE ---
 * Updates an existing address record in the database.
 * @param {number} addressId - The ID of the address to update.
 * @param {object} data - The update data for the address.
 * @returns {Promise.boolean>} Whether the update was successful.
 */
async function updateAddress(
  addressId,
  { street, city, state, zipCode, country, isDefault }
) {
  const sql = `SELECT update_address($1, $2, $3, $4, $5, $6, $7) AS success;`;
  const params = [addressId, street, city, state, zipCode, country, isDefault];
  const result = await db.query(sql, params);
  return result.rows[0].success;
}

/**
 * --- DELETE ---
 * Deletes an existing address record from the database.
 * @param {number} addressId - The ID of the address to delete.
 * @returns {Promise.boolean>} Whether the deletion was successful.
 */
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

