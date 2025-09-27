// src/controllers/userController.js
const userService = require("../services/userService");

// Handler for POST /users
async function createUserController(req, res) {
  try {
    // TODO Validation
    const userData = req.body;

    // Pass data to the Service layer
    const newUserId = await userService.createUser(userData);

    // Send the successful response
    res.status(201).json({
      message: "User created successfully",
      userId: newUserId,
    });
  } catch (error) {
    console.error("Controller Error:", error.message);
    // 3. Handle errors uniformly
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  createUserController,
};
