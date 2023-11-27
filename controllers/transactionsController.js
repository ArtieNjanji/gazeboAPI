const { pool } = require('../config/db');
const excel = require('exceljs');
const fs = require('fs');
const path = require('path');

// Get all transactions
const getAllTransactions = async (req, res) => {
  const query = `SELECT TOP 100 * FROM transactions`;
  try {
    const result = await pool.request().query(query);
    res.json(result.recordset);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
};

// Get a single transaction
const getTransaction = async (req, res) => {
  // Assuming the ID is passed as a route parameter
  const itemID = req.params.id;

  try {
    const query = `SELECT TOP 100 * FROM transactions WHERE transactionID = @itemID`;
    const result = await pool.request().input('itemID', itemID).query(query);

    if (result.recordset.length === 0) {
      res.status(404).json({ error: 'Item not found' });
    } else {
      res.json(result.recordset);
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Add a transaction
const addTransaction = async (req, res) => {
  let { itemBought, qty, totalCost } = req.body;

  date = new Date();
  dateString = date.toISOString().slice(0, 10).replace('T', '');
  clientID = req.user.mine_no;

  try {
    if (!itemBought || !qty || !totalCost) {
      res.status(400).json({ error: 'Please provide all required fields' });
      return;
    }

    const query = `INSERT INTO transactions (itemBought, date, clientID, qty,  totalCost, dateString ) 
                    VALUES (@itemBought,GETDATE(), @clientID, @qty, @totalCost, @dateString)`;

    await pool
      .request()
      .input('itemBought', itemBought)
      .input('clientID', clientID)
      .input('qty', qty)
      .input('totalCost', totalCost)
      .input('dateString', dateString)
      .query(query);

    res.status(201).json({ message: 'Item added successfully' });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

//generate excel report
const getAllTransactionsToExcel = async (req, res) => {
  const query = `SELECT TOP 100
                      transactionID,
                      clientID,
                      itemBought,
                      date,
                      qty,
                      totalCost FROM transactions ORDER BY timestamp DESC`;
  try {
    const result = await pool.request().query(query);

    // Create a new Excel workbook and worksheet
    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet('Transactions');

    // Add headers to the worksheet
    const headers = Object.keys(result.recordset[0]);
    worksheet.addRow(headers);

    // Add data to the worksheet
    result.recordset.forEach((transaction) => {
      const rowValues = headers.map((header) => transaction[header]);
      worksheet.addRow(rowValues);
    });

    // Define the file path where you want to save the Excel file
    const filePath = path.join(
      __dirname,
      '../../../Chivasa/Documents',
      'transactions.xlsx'
    );

    // Write the workbook to the defined file path
    await workbook.xlsx.writeFile(filePath);

    console.log('Excel file saved successfully.');
  } catch (err) {
    console.error('Error:', err.message);
  }
};

module.exports = {
  getAllTransactions,
  getTransaction,
  addTransaction,
  getAllTransactionsToExcel,
};
