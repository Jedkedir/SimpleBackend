const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userService = require("../services/userService");
const generateToken = require("../utils/generateToken");
const db = require('../db/pool');

exports.registerController = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
    isAdmin = false,
  } = req.body;

  if (!email || !password || !firstName || !lastName) {
    return res
      .status(400)
      .json({ error: "Please provide all required fields" });
  }

  try {
    
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    
    const { rows } = await db.query('SELECT COUNT(*) FROM users');
    const userCount = parseInt(rows[0].count);
    const isFirstUser = userCount === 0;

    
    const userId = await userService.createUser({
      firstName,
      lastName,
      email,
      passwordHash,
      phoneNumber,
      isAdmin: isFirstUser, 
    });

    
    res.status(201).json({
      userId,
      email,
      firstName,
      lastName,
      phoneNumber,
      isAdmin: isFirstUser,
      token: generateToken(userId),
      role: isFirstUser ? "admin" : "user",
    });
  } catch (error) {
    
    if (error.message && error.message.includes("unique constraint")) {
      return res.status(400).json({ error: "Email already registered" });
    }
    console.error("Error during registration:", error.message);
    res.status(500).json({ error: "Server error during registration" });
  }
};


exports.loginController = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Please provide email and password" });
  }

  try {
    
    const user = await userService.getUserByEmail(email);

    if (user && (await bcrypt.compare(password, user.password_hash))) {
      
      res.json({
        userId: user.user_id,
        firstName: user.first_name,
        lastName: user.last_name,
        phoneNumber: user.phone_number,
        email: user.email,
        isAdmin: user.is_admin,
        token: generateToken(user.user_id),
        role: user.is_admin ? "admin" : "user",
      });
    } else {
      
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ error: "Server error during login" });
  }
};


exports.addAdmin = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
    userId,
  } = req.body;

  const sql = 'SELECT is_admin FROM users WHERE user_id = $1';
  const result = await db.query(sql, [userId]);
  
  if (result.rows[0].is_admin === true) {
    if (!email || !password || !firstName || !lastName) {
      console.log(email)
      console.log(password)
      console.log(firstName)
      console.log(lastName)
    return res
      .status(400)
      .json({ error: "Please provide all required fields" });
    }
    try {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      
      


      
      const userId = await userService.createUser({
        firstName,
        lastName,
        email,
        passwordHash,
        phoneNumber,
        isAdmin: true,
      });

      
      res.status(201).json({
        userId,
        email,
        token: generateToken(userId),
      });
    }
    catch (error) {
      
      if (error.message && error.message.includes("unique constraint")) {
        return res.status(400).json({ error: "Email already registered" });
      }
      console.error("Error during registration:", error.message);
      res.status(500).json({ error: "Server error during registration" });
    }
  }
  else {
    res.status(400).json({error: "You are not allowed to make this change"});
  }

  
}

