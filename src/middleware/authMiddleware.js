const jwt = require("jsonwebtoken");
const userService = require("../services/userService");

/**
 * Middleware to protect routes.
 * Checks for a valid JWT in the Authorization header.
 */
exports.protect = async (req, res, next) => {
  let token;

  // 1. Check if token exists in the header (Format: "Bearer TOKEN")
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // 2. Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Attach user data to request (excluding password hash)
      // We use the get_user_by_id service function
      const user = await userService.getUserById(decoded.userId);

      if (!user) {
        return res
          .status(401)
          .json({ error: "Not authorized, user not found" });
      }

      // Attach user object to request for use in controllers
      req.user = user;
      next();
    } catch (error) {
      console.error("JWT Verification Error:", error.message);
      // If verification fails (e.g., token expired/invalid)
      res.status(401).json({ error: "Not authorized, token failed" });
    }
  }

  // 4. Handle case where token is missing
  if (!token) {
    res.status(401).json({ error: "Not authorized, no token" });
  }
};
