
const db = require("../db/pool");

async function createAddress({
  userId,
  street,
  street_2,
  city,
  state,
  postalCode,
  country,
}) {
  const sql = `SELECT create_address($1, $2, $3, $4, $5, $6, $7) AS address_id;`;
  const params = [userId, street,street_2, city, state, postalCode, country];
  const result = await db.query(sql, params);
  return result.rows[0].address_id;
}


async function getAddressesByUserId(userId) {
  const sql = `SELECT * FROM get_addresses_by_user_id($1);`;
  const result = await db.query(sql, [userId]);
  return result.rows;
}


async function updateAddress(
  addressId,
  { street, city, state, zipCode, country, isDefault }
) {
  const sql = `SELECT update_address($1, $2, $3, $4, $5, $6, $7) AS success;`;
  const params = [addressId, street, city, state, zipCode, country, isDefault];
  const result = await db.query(sql, params);
  return result.rows[0].success;
}


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

