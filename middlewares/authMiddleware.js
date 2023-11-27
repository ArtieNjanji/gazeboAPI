const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');

const getUserFromDB = async (mineNo) => {
  const result = await pool
    .request()
    .input('mine_no', mineNo)
    .query('SELECT * FROM users WHERE mine_no = @mine_no');
  return result.recordset[0];
};

const authMiddleware = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await getUserFromDB(decoded.mine_no);
      if (!req.user) throw new Error('User not found');
      next();
    } else {
      throw new Error('Not authorized, no token');
    }
  } catch (error) {
    console.error('Authentication error:', error.message);
    res.status(401).json({ error: 'Not authorized' });
    return;
  }
};

module.exports = authMiddleware;
