/**
 * Module for creating and exporting a PostgreSQL pool object.
 * @module src/db/pool
 * @description This module exports a PostgreSQL pool object for use in the application.
 */


const { Pool } = require("pg");


const dbConfig = require("../config/db.config");


const pool = new Pool(dbConfig);

/**
 * Utility function to execute queries safely.
 * @function query
 * @param {string} text - The SQL query to be executed
 * @param {array} params - The parameters to be used in the query
 * @returns {Promise} - A promise containing the query result
 */
const query = (text, params) => {
  return pool.query(text, params);
};

/**
 * Export the PostgreSQL pool object for use in the application.
 * @type {Object}
 * @property {Function} query - Utility function to execute queries safely
 * @property {Object} pool - The PostgreSQL pool object
 */
module.exports = {
  query,
  pool,
};

