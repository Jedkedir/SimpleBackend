// src/db/pool.js
const { Pool } = require("pg");
const config = require("../config/db.config"); // Assume you load config details here

const pool = new Pool(config.db);

// Utility function to execute queries safely
const query = (text, params) => {
  return pool.query(text, params);
};

module.exports = {
  query,
  pool, // Export the pool if needed for transactions
};
