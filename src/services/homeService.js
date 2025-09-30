const db = require("../db/pool");


async function getBestSelling() {
  const sql = `
    `;
  const result = await db.query(sql);
  return result.rows;
}

async function getFeatures() {
  const sql = `
  `;
  const result = await db.query(sql);
  return result.rows;
}

module.exports = {
  getTotalSold,
  getTotalRevenue,
};
