/*************  ✨ Windsurf Command ⭐  *************/
module.exports = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres',
  database: process.env.DB_NAME || 'simple_backend',
  password: process.env.DB_PASSWORD || '0000',
  port: process.env.DB_PORT || 5432,
};
/*******  a0e74d07-f3b2-476c-ae9d-454c8c0295f4  *******/