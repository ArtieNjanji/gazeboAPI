let config = require('../config/db.js');
const sql = require('mssql');

const { pool } = require('../config/db.js');

// Get all stockItems
const getAllStockItems = async (req, res) => {
  try {
    const result = await pool.request().query('SELECT * from stockItems');
    res.json(result.recordset);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
};

//get stockItem by id
const getStockItemById = async (req, res) => {
  const itemID = req.params.id; // Assuming the ID is passed as a route parameter

  try {
    const query = `SELECT * FROM stockItems WHERE itemCode = ${itemID}`;
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

// add stockItem
const addStockItem = async (req, res) => {
  const { itemDescription, itemCategory, currentPrice } = req.body;

  try {
    if (!itemDescription || !currentPrice || !itemCategory) {
      res.status(400).json({ error: 'Please provide all required fields' });
      return;
    }

    const query = `INSERT INTO stockItems (itemDescription, itemCategory,  currentPrice) 
                    VALUES ('${itemDescription}', '${itemCategory}', ${currentPrice})`;
    const result = await pool.request().query(query);

    res.status(201).json({ message: 'Item added successfully' });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const deleteStockItem = async (req, res) => {
  try {
    // Assuming the itemCode is passed as a route parameter
    const itemID = req.params.id;

    // Check if itemID is missing
    if (!itemID) {
      return res.status(400).json({ error: 'Invalid item code' });
    }

    const query = `DELETE FROM stockItems WHERE itemCode = ${itemID}`;
    const result = await pool.request().query(query);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

//update stockItem
const updateStockItem = async (req, res) => {
  try {
    // Assuming the itemCode is passed as a route parameter
    const itemID = req.params.id;

    const { itemDescription, itemCategory, currentPrice } = req.body;

    // Check if itemID is missing
    if (!itemID) {
      return res.status(400).json({ error: 'Invalid item code' });
    }

    // Check if required fields are missing
    if (!itemDescription || !currentPrice || !itemCategory) {
      return res.status(400).json({ error: 'Required fields are missing' });
    }

    const query = `UPDATE stockItems
                    SET itemDescription = '${itemDescription}', 
                        itemCategory = '${itemCategory}', 
                        currentPrice = ${currentPrice}
                    WHERE itemCode = ${itemID}`;

    const result = await pool.request().query(query);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.status(200).json({ message: 'Item updated successfully' });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  getAllStockItems,
  getStockItemById,
  addStockItem,
  deleteStockItem,
  updateStockItem,
};
