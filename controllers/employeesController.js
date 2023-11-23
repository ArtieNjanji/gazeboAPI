const { pool } = require('../config/db');

const getEmployees = async (req, res) => {
  const query = `SELECT * FROM employees`;
  try {
    const result = await pool.request().query(query);
    res.json(result.recordset);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
};
const getEmployee = async (req, res) => {
  const employeeID = req.params.id;
  try {
    const query = `SELECT * FROM employees WHERE mine_no = ${employeeID}`;
    const result = await pool.request().query(query);

    if (result.recordset.length === 0) {
      res.status(404).json({ error: 'Employee not found' });
    } else {
      res.json(result.recordset);
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const addEmployee = async (req, res) => {
  const { mine_no, first_name, surname, grade } = req.body;
  try {
    if (!mine_no || !first_name || !surname || !grade) {
      res.status(400).json({ error: 'Please provide all required fields' });
      return;
    }

    // Check if employee with the provided mine_no already exists
    const checkQuery = `SELECT COUNT(*) AS count FROM employees WHERE mine_no = ${mine_no}`;
    const result = await pool.request().query(checkQuery);
    const count = result.recordset[0].count;

    if (count > 0) {
      res
        .status(400)
        .json({ error: 'Employee with this mine number already exists' });
      return;
    }

    const query = `INSERT INTO employees (mine_no, firstName, surname, grade) 
                    VALUES (${mine_no}, '${first_name}', '${surname}', '${grade}')`;

    await pool.request().query(query);

    res.status(201).json({ message: 'Employee added successfully' });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const updateEmployee = async (req, res) => {
  const { mine_no, first_name, surname, grade } = req.body;
  try {
    if (!mine_no || !first_name || !surname || !grade) {
      res.status(400).json({ error: 'Please provide all required fields' });
      return;
    }

    const query = `UPDATE employees SET mine_no=${mine_no}, firstName='${first_name}', surname='${surname}', grade='${grade}' WHERE mine_no='${mine_no}'`;

    await pool.request().query(query);

    res.status(201).json({ message: 'Employee updated successfully' });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const deleteEmployee = async (req, res) => {
  const employeeID = req.params.id;
  try {
    // Check if employee with the provided mine_no already exists
    const checkQuery = `SELECT COUNT(*) AS count FROM employees WHERE mine_no = ${employeeID}`;
    const result = await pool.request().query(checkQuery);
    const count = result.recordset[0].count;

    if (count < 1) {
      res.status(400).json({ error: 'Employee does exists' });
      return;
    }

    const query = `DELETE FROM employees WHERE mine_no = ${employeeID}`;
    await pool.request().query(query);

    res.status(201).json({ message: 'Employee deleted successfully' });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  getEmployees,
  getEmployee,
  addEmployee,
  updateEmployee,
  deleteEmployee,
};
