const bcrypt = require('bcrypt');
const pool = require('../config/db');


// exports.signUp = async (req, res, next) => {
//     try {
//         const {first_name, last_name, email, password} = req.body;
//         const hash_password = await bcrypt.hash(password, 10);
        
//         const { rows } =   await pool.query('SELECT COUNT(*) FROM users');
//         const isAdmin = parseInt(rows[0].count) === 0;   

//         const result = await pool.query(
//             'INSERT INTO users (first_name, last_name, email, password_hash, is_admin, phone_number) VALUES ($1, $2, $3, $4, $5, $6) RETURNING user_id, email, is_admin', [first_name, last_name, email, hash_password, isAdmin, phone_number]
//         );

//         res.status(201).json({ message: "Success", user: result.rows[0] }); 
//     }
//     catch(err) {
//         console.error(err);
//         res.status(500).json({ error: 'Error occurred while signing up' });
//     }
// }

exports.signUp = async (req, res) => {
    try {
        const {first_name, last_name, email, password} = req.body;
        const userFound = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const adminFound = await pool.query('SELECT * FROM admins WHERE email = $1', [email]);

        if (userFound.rows.length > 0 || adminFound.rows.length > 0) {
            return res.status(400).json({ error: 'Email already exists'});
        }
        const hashed_password = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (first_name, last_name, email, password_hash) VALUES ( $1, $2, $3, $4) RETURNING user_id, email', 
            [first_name, last_name, email, hashed_password]
        );

        res.status(201).json({
            message: 'User registered successfully',
            user: {id: result.rows[0].user_id, email: result.rows[0].email, role: 'user'}
        });
    }
    catch(err) {
        console.error(err);
        res.status(500).json({ error: 'Error during signup' });
    }
}

// exports.login = async (req, res, next) => {
//     try {
//         const { email, password} = req.body;
//         const { rows } = await pool.query('SELECT * FROM users WHERE email = $1',[email]);
//         if (rows.length === 0) {
//             return res.status(400).json({error: 'User is not found'});
//         }

//         const user = rows[0]
//         const match = await bcrypt.compare(password, user.password_hash);
//         if (!match) {
//             return res.status(400).json({error: 'Invalid Password'})
//         }

//         res.status(200).json({
//             message: 'Successfully Logged In',
//             user: {
//                 userId: user.user_id,
//                 email: user.email,
//                 isAdmin: user.is_admin
//             }
//         })
//     }
//     catch(err) {
//         console.error(err);
//         res.status(500).json({ error: 'Error occurred while logging in' });
//     }
// }

exports.login = async (req, res) => {
    try {
        const {email, password} = req.body;

        let result =  await pool.query('SELECT * FROM admins WHERE email = $1', [email]);
        if (result.rows.length > 0) {
            const adminRes = result.rows[0];
            const checkMatch = await bcrypt.compare(password, adminRes.password_hash);
            if (!checkMatch) {
                return res.status(400).json({error: 'Invalid Password'});
            }

            return res.json({
                message: 'Admin login successful',
                user: {id: adminRes.admin_id, email: adminRes.email, role: 'admin'}
            });

        }

        result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(400).json({error: 'User not Found'})
        }

        const user = result.rows[0];
        const checkMatch = await bcrypt.compare(password, user.password_hash);
        if (!checkMatch) {
            return res.status(400).json({error: 'Invalid Password'});
        }

        return res.json({
            message: 'User login successful',
            user: {id: user.user_id, email: user.email, role: 'user'}
        })
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error during login' });
    }
}