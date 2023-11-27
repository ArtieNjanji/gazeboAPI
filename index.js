const express = require('express');
const app = express();
require('dotenv').config();

const helmet = require('helmet');
const cors = require('cors');

const { pool } = require('./config/db.js');


//route imports
const stockItemsRoute = require('./routes/stockItemsRoutes.js');
const stockSalesRoute = require('./routes/stockSalesRoutes.js');
const transactionsRoute = require('./routes/transactionRoutes.js');
const employeesRoute = require('./routes/employeeRoutes.js');
const usersRoute = require('./routes/usersRoutes.js');

const port = parseInt(process.env.SERVER_PORT);

//middleware
app.use(express.json());
app.use(helmet());
app.use(cors());

//routes
app.use('/api/stock-items', stockItemsRoute);
app.use('/api/stock-sales', stockSalesRoute);
app.use('/api/transactions', transactionsRoute);
app.use('/api/employees', employeesRoute);
app.use('/api/users', usersRoute);

//server
const server = async () => {
  try {
    await pool.connect();
    app.listen(port, () => console.log(`Server starts at port ${port}`));
  } catch (error) {
    console.log(error);
  }
};
server();
