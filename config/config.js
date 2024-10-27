// config/db.config.js
const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'A1ay79/6@.c60',
  database: 'aiwebbase',
  waitForConnections: true,
  connectionLimit: 10,
};

const pool = mysql.createPool(dbConfig);

const connectDB = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Connected to MySQL successfully!');
    connection.release();
    return pool;
  } catch (err) {
    console.error('Error connecting to MySQL:', err);
    throw err;
  }
};

module.exports = { pool, connectDB };