const excel = require('exceljs');
const { pool } = require('../config/db');

const createExcelFromTransactions = async (startDate, endDate) => {
  const workbook = new excel.Workbook();
  const worksheet = workbook.addWorksheet('Transactions');

  try {
    const query = `SELECT * FROM transactions WHERE CONVERT(DATE, dateString, 103) >= '${startDate}' AND CONVERT(DATE, dateString, 103) <= '${endDate}'`;
    const result = await pool.request().query(query);

    // Add headers to the worksheet
    worksheet.columns = [
      { header: 'Transaction ID', key: 'transactionID', width: 15 },
      { header: 'Item Bought', key: 'itemBought', width: 20 },
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Client ID', key: 'clientID', width: 15 },
      { header: 'Quantity', key: 'qty', width: 10 },
      { header: 'Total Cost', key: 'totalCost', width: 15 },
      { header: 'Date String', key: 'dateString', width: 15 },
    ];

    // Add data rows to the worksheet
    result.recordset.forEach((transaction) => {
      worksheet.addRow({
        transactionID: transaction.transactionID,
        itemBought: transaction.itemBought,
        date: transaction.date,
        clientID: transaction.clientID,
        qty: transaction.qty,
        totalCost: transaction.totalCost,
        dateString: transaction.dateString,
      });
    });

    // Save the workbook as an Excel file
    const filePath = 'Documents/file.xlsx';
    await workbook.xlsx.writeFile(filePath);

    console.log('Excel file created successfully');
  } catch (err) {
    console.error('Error creating Excel file:', err.message);
  }

  return;
};

export async function createExcelFromTransactions(startDate) {
  const workbook = new excel.Workbook();
  const worksheet = workbook.addWorksheet('Transactions');

  try {
    const query = `
      SELECT * 
      FROM transactions 
      WHERE transaction_date BETWEEN '${startDate}' AND GETDATE()
    `;

    // Assuming you have a way to execute queries using dbConnection
    const result = await pool.query(query);
    const rows = result.rows;

    // Adding headers to Excel
    const headers = Object.keys(rows[0]);
    worksheet.addRow(headers);

    // Adding data to Excel
    rows.forEach((row) => {
      const rowData = Object.values(row);
      worksheet.addRow(rowData);
    });

    // Writing to file
    const filename = `transactions_from_${startDate}.xlsx`;
    await workbook.xlsx.writeFile(filename);
    console.log(`Excel file "${filename}" created successfully!`);
    return filename;
  } catch (err) {
    console.error('Error:', err);
  }
}

const startDate = '2023-01-01';

createExcelFromTransactions(startDate);
