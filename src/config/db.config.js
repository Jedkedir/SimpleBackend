/**
 * Configuration object for the PostgreSQL pool.
 * @module src/config/db.config
 * @description This module exports a configuration object for the PostgreSQL pool.
 * The configuration object is populated from environment variables. 
 * @exports {Object} - The configuration object for the PostgreSQL pool.
 */
module.exports = {
  /**
   * The host name of the server the database is running on.
   * @type {string}
   * @default process.env.DB_HOST
   */
  host: process.env.DB_HOST,
  /**
   * The username to use when connecting to the database.
   * @type {string}
   * @default process.env.DB_USER
   */
  user: process.env.DB_USER,
  /**
   * The name of the database to connect to.
   * @type {string}
   * @default process.env.DB_NAME
   */
  database: process.env.DB_NAME,
  /**
   * The password to use when connecting to the database.
   * @type {string}
   * @default process.env.DB_PASSWORD
   */
  password: process.env.DB_PASSWORD,
  /**
   * The port number to use when connecting to the database.
   * @type {number}
   * @default process.env.DB_PORT
   */
  port: process.env.DB_PORT,
};

