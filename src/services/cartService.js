
const db = require("../db/pool");

async function createCart(userId) {
  
  const query = "SELECT get_or_create_cart($1) AS cart_id";
  const result = await db.query(query, [userId]);
  console.log(userId, result.rows[0]);
  return result.rows[0].cart_id;
}

async function getCartByUserId(userId) {
  const query = `
    SELECT get_or_create_cart($1) AS cart_id
  `;
  const result = await db.query(query, [userId]);
  
  return result.rows[0];
}


async function deleteCart(cartId) {
 
  const query = `
    DELETE FROM carts c
    WHERE c.cart_id = $1
  `;
  const result = await db.query(query, [cartId]);
  return result.rowCount === 1;
}

module.exports = {
  createCart,
  getCartByUserId,
  deleteCart,
};

