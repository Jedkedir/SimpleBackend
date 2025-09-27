// src/db/pool.js
const { Pool } = require("pg");
// Import the configuration object
const dbConfig = require("../config/db.config");

// Use the imported configuration object directly for the Pool initialization
const pool = new Pool(dbConfig);

// Utility function to execute queries safely
const query = (text, params) => {
  return pool.query(text, params);
};

module.exports = {
  query,
  pool, // Export the pool if needed for transactions
};
