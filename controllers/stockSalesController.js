const { pool } = require('../config/db.js');

// Get all stockSales
const getAllStockSales = async (req, res) => {
  try {
    const result = await pool
      .request()
      .query('SELECT TOP 100 * from stockSales');
    res.json(result.recordset);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
};

//get stockSale by period
const getStockSale = async (req, res) => {
  const itemID = req.params.id; // Assuming the ID is passed as a route parameter

  try {
    const query = `SELECT * FROM stockSales WHERE dateString like '%${itemID}%'`;
    const result = await pool.request().query(query);

    if (result.recordset.length === 0) {
      res.status(404).json({ error: 'Item not found' });
    } else {
      res.json(result.recordset);
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// add stockSale
const addStockItem = async (req, res) => {
  let { itemDescription, qtySold, unitPrice, dateString } = req.body;

  dateString = new Date().toISOString().slice(0, 10).replace('T', ' ');

  try {
    if (!itemDescription || !qtySold || !unitPrice) {
      res.status(400).json({ error: 'Please provide all required fields' });
      return;
    }

    const query = `INSERT INTO stockSales (itemDescription, qtySold,  unitPrice, dateString) 
                    VALUES (@itemDescription, @qtySold, @unitPrice, @dateString)`;

    await pool
      .request()
      .input('itemDescription', itemDescription)
      .input('qtySold', qtySold)
      .input('unitPrice', unitPrice)
      .input('dateString', dateString)
      .query(query);

    res.status(201).json({ message: 'Item added successfully' });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  getAllStockSales,
  getStockSale,
  addStockItem,
};
