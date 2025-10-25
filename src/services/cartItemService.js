
const db = require("../db/pool");

async function addOrUpdateCartItem({ userId, variantId, quantity }) {
  // Assumes a function that handles both adding a new item or updating quantity
  const sql = `SELECT add_to_cart($1, $2, $3) AS cart_item_id;`;
  const params = [userId, variantId, quantity];
  const result = await db.query(sql, params);
  console.log(result.rows[0])
  return result.rows[0].cart_item_id;
}


async function getCartItems(userId) {
  const sql = `
    SELECT 
    ci.cart_item_id,
    ci.cart_id,
    ci.variant_id,
    ci.quantity,
    pv.color AS variant_color,
    pv.size AS variant_size,
    pv.price AS variant_price,
    pv.image_url AS variant_image,
    p.name AS product_name
FROM cart_items ci
JOIN carts c ON ci.cart_id = c.cart_id
JOIN product_variants pv ON ci.variant_id = pv.variant_id
JOIN products p ON pv.product_id = p.product_id
WHERE c.user_id = $1;

    ;`;
  const result = await db.query(sql, [userId]);
  return result.rows;
}


async function removeCartItem(cartItemId) {
  const query = `
    DELETE FROM cart_items
    WHERE cart_item_id = $1
    RETURNING TRUE AS success;
  `;
  const result = await db.query(query, [cartItemId]);
  return result.rows[0].success;
}

async function updateCartItemQuantity(cartItemId, quantity) {
  console.log(cartItemId, quantity);
  const query = `
    UPDATE cart_items
    SET quantity = $2
    WHERE cart_item_id = $1
    RETURNING TRUE AS success;
  `;
  const result = await db.query(query, [cartItemId, quantity]);
  return result.rows[0].success;
}

module.exports = {
  addOrUpdateCartItem,
  updateCartItemQuantity,
  getCartItems,
  removeCartItem,
};

