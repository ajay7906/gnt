// // config/db.config.js
// const mysql = require('mysql2/promise');

// const dbConfig = {
//   host: 'localhost',
//   user: 'root',
//   password: 'A1ay79/6@.c60',
//   database: 'aiwebbase',
//   waitForConnections: true,
//   connectionLimit: 10,
// };

// const pool = mysql.createPool(dbConfig);

// const connectDB = async () => {
//   try {
//     const connection = await pool.getConnection();
//     console.log('Connected to MySQL successfully!');
//     connection.release();
//     return pool;
//   } catch (err) {
//     console.error('Error connecting to MySQL:', err);
//     throw err;
//   }
// };

// module.exports = { pool, connectDB };



// src/config/database.js
const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const promisePool = pool.promise();

module.exports = promisePool;