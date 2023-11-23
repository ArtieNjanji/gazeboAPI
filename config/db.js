const sql = require('mssql');
require('dotenv').config();

const config = {
  user: process.env.USER,
  password: process.env.PASSWORD,
  server: process.env.SERVER,
  database: process.env.DATABASE,
  port: parseInt(process.env.DB_PORT),
  options: {
    trusted_Connection: true,
    trustServerCertificate: true,
    encrypt: true,
  },
};

const pool = new sql.ConnectionPool(config);

module.exports = {
  sql,
  pool,
};
