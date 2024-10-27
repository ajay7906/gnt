
// middleware/db.middleware.js
const { pool } = require('../config/config');

const dbMiddleware = async (req, res, next) => {
  try {
    const connection = await pool.getConnection();
    req.dbConnection = connection;
    next();
  } catch (err) {
    console.error('Database middleware error:', err);
    res.status(500).json({ error: 'Database connection error' });
  }
};

module.exports = dbMiddleware;