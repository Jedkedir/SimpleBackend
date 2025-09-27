const pool = require('../config/db');

exports.getCategory = async (req, res, next) => {
    try {
        const { rows } = await pool.query('SELECT * FROM categories');
        res.status(201).json({message: "Category retrived", rows});
    }
    catch(err) {
        console.log(err)
        res.status(500).json({message: "Error occured while getting category"});
    }
}

exports.addCategory = async (req, res) => {
    try {
        const { name } = req.body
        const { rows } = await pool.query ('INSERT INTO categories (name) VALUES ($1) RETURNING *', [name]);
        res.status(201).json({message: "Category added", category: rows[0]})
    }
    catch (err) {
        res.status(500).json({message: "Error add category"});
    }
}
