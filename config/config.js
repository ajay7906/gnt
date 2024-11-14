



// // src/config/database.js
// const mysql = require('mysql2');
// require('dotenv').config();

// const pool = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// });



// const promisePool = pool.promise();



// promisePool.connect((err) => {  
//   if (err) {    
//     console.error('Error connecting to MySQL:', err);    
//     return;    
//   }    
//   console.log('Connected to MySQL database');    
// });

// module.exports = promisePool;















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

// Convert pool to use promises
const promisePool = pool.promise();

// Test the connection
promisePool.query('SELECT 1')
  .then(() => {
    console.log('Connected to MySQL database');
  })
  .catch((err) => {
    console.error('Error connecting to MySQL:', err);
  });

module.exports = promisePool;