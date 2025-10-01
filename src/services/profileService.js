
const db = require("../db/pool");

async function getProfileInfo(userId) {
    const sql = `
        SELECT first_name, last_name, email FROM users WHERE user_id = $1;
    `
    const result = await db.query(sql, [userId]);
    return result.rows;
}

async function getUserInfoByUserId(userId) {
    const sql = `
       SELECT DISTINCT
        u.user_id,
        u.first_name,
        u.last_name,
        u.email,
        r.rating,
        r.comment,
        p.product_id,
        p.name AS product_name,
        p.price,
        pv.variant_id,
        pv.color,
        pv.size,
        pv.image_url AS variant_image
    FROM reviews r
    JOIN users u ON r.user_id = u.user_id
    JOIN products p ON r.product_id = p.product_id
    LEFT JOIN product_variants pv ON p.product_id = pv.product_id
    WHERE u.user_id = $1;
     `
     const result = await db.query(sql, [userId]);
     return result.rows;
}

module.exports = {
    getProfileInfo,
    getUserInfoByUserId
}

