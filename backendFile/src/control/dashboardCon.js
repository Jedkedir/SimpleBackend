const pool = require('../config/db');

exports.topSelling = async (req, res) => {
    try {
        const {rows} = pool.query(
            `SELECT prod.product_id, prod.name AS prod_name, MIN(prod_var.image_url) AS image_url, SUM(ord_it.quantity) AS total_sold FROM products prod
            JOIN product_variants prod_var ON prod.product_id = prod_var.product_id
            JOIN order_items ord_it ON prod_var.variant_id = ord_it.variant_id
            GROUP BY prod.product_id, prod.name
            ORDER BY total_sold DESC
            LIMIT 10
            `
        );

        res.status(200).json({message: 'Top 10 selling products', products: rows});
    }
    catch(err) {
        console.error(err)
        res.status(500).json({error: 'Error occured'})
    }
}

exports.totalSold = async (req, res) => {
    try {
        const {rows} = await pool.query('SELECT SUM(ord_items.quantity) AS total_sold FROM order_items ord_items');
        res.status(200).json({total_sold_prod: rows[0].total_sold});
    }
    catch(err) {
        console.error(err);
        res.status(500).json({error: "Error fetching the total"})
    }
}

exports.totalRevenue = async(req, res) => {
    try {
        const {rows} = await pool.query('SELECT SUM(ord_it.quantity * ord_it.price) AS total_revenue FROM order_items ord_it');

        res.status(200).json({total_Rev: rows[0].total_revenue});
    }
    catch(err) {
        console.error(err);
        res.status(500).json({error: "Error fetching the revenue"})
    }
}


exports.getStock = async (req, res) => {
    try {
        const {rows} = await pool.query(`
            SELECT prod.product_id, prod.name AS product_name,prod.image_url, COALESCE(SUM(prod_var.stock_quantity), 0) AS total_stock
            FROM products p
            LEFT JOIN Product_variants prod_var ON prod.product_id = prod_var.product_id
            GROUP BY prod.product.id , prod.name, prod.image_url
            ORDER BY prod.product_id
        `);

        res.status(200).json({
            message: 'Products with total stock quantities',
            products: rows
        });

    }
    catch(err) {
        console.error(err)
        res.status(500).json({error: "Error fetching the stock"})
    }
}