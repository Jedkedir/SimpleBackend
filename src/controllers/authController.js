const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userService = require("../services/userService");

// Helper function to generate JWT
const generateToken = (userId) => {
  // JWT_SECRET should be set in your .env file
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d", // Token expires in 30 days
  });
};

/**
 * --- POST /api/auth/register ---
 * Registers a new user and returns a JWT.
 */
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
    // 1. Hash the password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 2. Create user via the service (which calls the PG function)
    const userId = await userService.createUser({
      firstName,
      lastName,
      email,
      passwordHash,
      phoneNumber,
      isAdmin,
    });

    // 3. Generate token and respond
    res.status(201).json({
      userId,
      email,
      token: generateToken(userId),
    });
  } catch (error) {
    // Handle unique constraint error on email
    if (error.message && error.message.includes("unique constraint")) {
      return res.status(400).json({ error: "Email already registered" });
    }
    console.error("Error during registration:", error.message);
    res.status(500).json({ error: "Server error during registration" });
  }
};

/**
 * --- POST /api/auth/login ---
 * Authenticates a user and returns a JWT.
 */
exports.loginController = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Please provide email and password" });
  }

  try {
    // 1. Fetch user by email (we need a new service function for this)
    // ASSUMPTION: You will implement a new PG function: get_user_by_email(text)
    const user = await userService.getUserByEmail(email);

    if (user && (await bcrypt.compare(password, user.password_hash))) {
      // 2. Password matches, generate token
      res.json({
        userId: user.user_id,
        email: user.email,
        token: generateToken(user.user_id),
      });
    } else {
      // 3. Authentication failed
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ error: "Server error during login" });
  }
};
