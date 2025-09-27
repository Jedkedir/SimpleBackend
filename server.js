const express = require("express");
const { query, pool } = require("./src/db/pool"); 
const { getUserById } = require("./src/services/userService"); 
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(express.json());

// --- Database Initialization ---
async function connectToDb() {
  try {
    await pool.connect();
    console.log("Successfully connected to PostgreSQL database pool.");
  } catch (err) {
    console.error("❌ Database connection failed:", err.stack);
    // Exit the process if the database connection fails critically
    process.exit(1);
  }
}

// --- API Routes ---

// GET /users/:id - Endpoint to retrieve a single user by ID
app.get("/users/:id", async (req, res) => {
  // 1. Validate the input parameter
  const userId = parseInt(req.params.id, 10);

  if (isNaN(userId) || userId <= 0) {
    return res.status(400).json({ error: "Invalid user ID provided." });
  }

  try {
    // 2. Call the service layer with the validated integer ID
    const user = await getUserById(userId);
    console.log(user);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // 3. Send the successful response
    console.log(`Fetched user: ${user.first_name} ${user.last_name}`);
    res.status(200).json(user);
  } catch (error) {
    // 4. Handle internal errors
    console.error("Error fetching user:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// --- Start Server ---

// Connect to DB, then start the server
connectToDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
