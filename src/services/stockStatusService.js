const db = require("../db/pool");

async function getInStock() {
    const sql = `
        SELECT 
            prod.product_id,
            prod.name,
            prod_var.stock_quantity AS stock_info,
            prod_var.image_url
        FROM 
            products prod
        LEFT JOIN
            product_variants prod_var ON prod.product_id = prod_var.product_id
        WHERE prod_var.stock_quantity > 0
    `

    const result = await db.query(sql);
    return result.rows[0];
}

async function getOutOfStock() {
    const sql = `
        SELECT 
            prod.product_id,
            prod.name,
            prod_var.stock_quantity AS stock_info,
            prod_var.image_url
        FROM 
            products prod
        LEFT JOIN
            product_variants prod_var ON prod.product_id = prod_var.product_id
        WHERE prod_var.stock_quantity = 0
    `;
    const result = await db.query(sql);
    return result.rows[0];
}

module.exports = {
    getInStock,
    getOutOfStock
}