const express = require("express");
const dotenv = require("dotenv");
const { pool } = require("./src/db/pool");
const path = require("path");
// Load environment variables from the .env file.
dotenv.config();

// --- ROUTER IMPORTS ---
// Core Application Routes
const userRoutes = require("./src/routes/userRoutes");
const addressRoutes = require("./src/routes/addressRoutes");
const categoryRoutes = require("./src/routes/categoryRoutes");
const productRoutes = require("./src/routes/productRoutes");
const productVariantRoutes = require("./src/routes/productVariantRoutes");
const cartRoutes = require("./src/routes/cartRoutes");
const cartItemRoutes = require("./src/routes/cartItemRoutes");
const orderRoutes = require("./src/routes/orderRoutes");
const orderItemRoutes = require("./src/routes/orderItemRoutes");
const paymentRoutes = require("./src/routes/paymentRoutes");
const reviewRoutes = require("./src/routes/reviewRoutes");
const dashboardRoutes = require("./src/routes/dashboardRoutes");
const stockRoutes = require("./src/routes/stockStatusRoute");
const homeRoutes = require("./src/routes/homeRoutes");
const uploadRoutes = require("./src/routes/uploadRoutes");
const profileRoutes = require("./src/routes/profileRoutes");

// Authentication Routes
const authRoutes = require("./src/routes/authRoutes");
const { protect } = require("./src/middleware/authMiddleware"); // Middleware to protect routes

const app = express();
const PORT = process.env.PORT || 8000;

/**
 * --- 1. Middleware Setup ---
 */
// Enable CORS for frontend communication
// Allows all origins for development (CHANGE TO YOUR FRONTEND URL IN PRODUCTION)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

// Middleware to parse JSON request bodies
app.use(express.json());



// Global error handler
app.use((error, req, res, next) => {
  
  logger.error("Global error handler triggered", {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    body: req.body,
    userId: req.user?.id, 
  });

  
  const statusCode = error.statusCode || 500;

  
  const isProduction = process.env.NODE_ENV === "production";

  res.status(statusCode).json({
    error: "Internal server error",
    message: isProduction ? "Something went wrong" : error.message,
    ...(isProduction ? {} : { stack: error.stack }), 
  });
});

const staticOptions = {
  etag: false,
  lastModified: false,
};

// 2 days for HTML files
app.use(
  "/.html$/",
  express.static(path.join(__dirname, "public"), {
    ...staticOptions,
    maxAge: "2d",
  })
);

// Short cache for CSS and JS (1 day)
app.use(
  "/css",
  express.static(path.join(__dirname, "public/css"), {
    ...staticOptions,
    maxAge: "1d",
  })
);

app.use(
  "/js",
  express.static(path.join(__dirname, "public/js"), {
    ...staticOptions,
    maxAge: "1d",
  })
);

app.use(
  "/images",
  express.static(path.join(__dirname, "public/images"), {
    ...staticOptions,
    maxAge: "7d",
  })
);

app.use(
  "/sample",
  express.static(path.join(__dirname, "public/sample"), {
    ...staticOptions,
    maxAge: "7d",
  })
);





// Public Auth routes (Login, Register) - NO PROTECTION
app.use("/api/auth", authRoutes);

// Protected routes (require a valid JWT using the 'protect' middleware)
// Routes related to profile, user-specific data, and checkout.
app.use("/api/users", protect, userRoutes);
app.use("/api/addresses", protect, addressRoutes);
app.use("/api/orders", protect, orderRoutes);
app.use("/api/payments", protect, paymentRoutes);
app.use("/api/reviews", protect, reviewRoutes);
app.use("/api/dashboard", protect, dashboardRoutes);
app.use("/api/stock", protect, stockRoutes);
app.use("/api/profile", protect, profileRoutes);

// Catalog, Cart, and Order Item routes - protection handled internally for specific CRUD actions
// (e.g., viewing products is public, deleting products is protected/admin only).
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/variants", productVariantRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/cart-items", cartItemRoutes);
app.use("/api/order-items", orderItemRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/upload", uploadRoutes);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));



async function connectAndListen() {
  try {
    
    await pool.query("SELECT 1");
    console.log("Successfully connected to the PostgreSQL database pool.");

    // Start the Express server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log("API is fully configured and ready to handle requests.");
    });
  } catch (err) {
    // Log detailed error and exit if DB connection fails
    console.error("Database connection or server start failed:", err.message);
    console.error("Stack:", err.stack);
    process.exit(1);
  }
}

connectAndListen();
