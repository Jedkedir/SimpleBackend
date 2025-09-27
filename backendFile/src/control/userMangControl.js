const bcrypt = require('bcrypt');
const pool = require('../config/db');

exports.getUsers = async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM users');
        if (rows.length == 0) {
            return res.status(400).json({message: 'No user found'})
        }
        res.status(201).json({message: "users retrieved", rows});

    }
    catch (err) {
        res.status(500).json({ error: 'Error occurred while getting users' })
    }
}

exports.getAdmins = async (req, res) => {
    try {
        const {rows} = await pool.query('SELECT * FROM admins');
        res.status(201).json({message: "admin retrieved", rows})
    }
    catch(err) {
        res.status(500).json({error: 'unable to retrieve the admins'})
    }
}

exports.deleteUsers = async (req, res) => {
    try {
        const userId = req.params.id;
        const { rows } =await pool.query('DELETE FROM users WHERE user_id = $1 RETURNING *', [userId]);
        if (rows.length === 0) {
            return res.status(404).json({message: 'User not Found'});
        }
        res.status(200).json({message: 'user deleted successfully', user: rows[0]});
    }
    catch(err) {
        res.status(500).json({error: 'Error deleting the user'});
    }
}

exports.addAdmins = async (req, res) => {
    try {
        const {first_name, last_name, email, password} = req.body;
        const hashed_password = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO admins (first_name, last_name, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING admin_id, email',
            [first_name, last_name, email, hashed_password]
        )
        
        res.status(201).json({
            message: 'Admin added successfully',
            user: {id: result.rows[0].admin_id, email: result.rows[0].email, role: 'admin'}
        });
    }
    catch (err) {
        res.status(500).json({message: 'Error adding admin'})
    }
}