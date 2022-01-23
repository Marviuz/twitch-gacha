const mysql = require('mysql2/promise');

const query = async (sql, params) => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_MAIN
  });

  try {
    const result = await connection.execute(sql, params);
    return result;
  } catch (err) {
    throw err;
  }
};

module.exports = query;