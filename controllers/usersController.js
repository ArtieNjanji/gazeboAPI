const bcrypt = require('bcrypt');
const { pool } = require('../config/db');

// Get all users
const getAllUsers = async (req, res) => {
  const query = `SELECT * FROM users`;
  try {
    const result = await pool.request().query(query);
    res.json(result.recordset);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
};

//get user
const getUser = async (req, res) => {
  const userID = req.params.id;
  try {
    const query = `SELECT * FROM users WHERE mine_no = ${userID}`;
    const result = await pool.request().query(query);

    if (result.recordset.length === 0) {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.json(result.recordset);
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};
/*const signup = async (req, res) => {
  let { mine_no, pass, admin, name, type, grade } = req.body;

  try {
    if (!mine_no) {
      res.status(400).json({ error: 'Mine number is required' });
      return;
    }
    // Check if employee with the provided mine_no exists
    const checkQueryEmployees = `SELECT * FROM employees WHERE mine_no = ${mine_no}`;
    const resultEmployees = await pool.request().query(checkQueryEmployees);
    const employee = resultEmployees.recordset[0];

    if (employee != null || employee != undefined) {
      const checkQueryUser = `SELECT COUNT(*) AS count FROM users WHERE mine_no = ${mine_no}`;
      const resultUser = await pool.request().query(checkQueryUser);
      const countUser = resultUser.recordset[0].count;

      if (countUser > 0) {
        res.status(400).json({ error: 'User already exists' });
      } else {
        name = employee.firstName + ' ' + employee.surname;
        grade = employee.grade;
        type = 'employee';
        admin = 0;

        const salt = await bcrypt.genSalt(10);
        pass = await bcrypt.hash(pass, salt);

        const query = `INSERT INTO users (mine_no, password, admin, name, type, grade) 
                        VALUES (${mine_no}, '${pass}', ${admin}, '${name}','${type}', '${grade}')`;

        const result = await pool.request().query(query);
        res.json(result);
      }
    } else {
      res.status(400).json({ error: 'Employee does not exist' });
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};*/
const signup = async (req, res) => {
  const { mine_no, pass } = req.body;

  try {
    if (!mine_no) {
      res.status(400).json({ error: 'Mine number is required' });
      return;
    }

    const checkQueryEmployees = `SELECT * FROM employees WHERE mine_no = @mine_no`;
    const resultEmployees = await pool
      .request()
      .input('mine_no', mine_no)
      .query(checkQueryEmployees);

    const employee = resultEmployees.recordset[0];

    if (employee) {
      const checkQueryUser = `SELECT COUNT(*) AS count FROM users WHERE mine_no = @mine_no`;
      const resultUser = await pool
        .request()
        .input('mine_no', mine_no)
        .query(checkQueryUser);

      const countUser = resultUser.recordset[0].count;

      if (countUser > 0) {
        res.status(400).json({ error: 'User already exists' });
      } else {
        const name = employee.firstName + ' ' + employee.surname;
        const grade = employee.grade;
        const type = 'employee';
        const admin = 0;

        const hashedPassword = await bcrypt.hash(pass, 10);
        const hashedPasswordBuffer = Buffer.from(hashedPassword, 'utf-8');

        const query = `
    INSERT INTO users (mine_no, password, admin, name, type, grade) 
    VALUES (@mine_no, @password, @admin, @name, @type, @grade)`;

        const result = await pool
          .request()
          .input('mine_no', mine_no)
          .input('password', hashedPasswordBuffer)
          .input('admin', admin)
          .input('name', name)
          .input('type', type)
          .input('grade', grade)
          .query(query);
        res.json(result);
      }
    } else {
      res.status(400).json({ error: 'Employee does not exist' });
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const signin = async (req, res) => {
  const { mine_no, pass } = req.body;

  try {
    if (!mine_no || !pass) {
      res.status(400).json({ error: 'Mine number and password are required' });
      return;
    }

    const checkQuery = `SELECT mine_no, password FROM users WHERE mine_no = @mine_no`;
    const result = await pool
      .request()
      .input('mine_no', mine_no)
      .query(checkQuery);

    const user = result.recordset[0];

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const hashedPasswordString = user.password.toString('utf-8');
    const passwordMatch = await bcrypt.compare(pass, hashedPasswordString);

    if (passwordMatch) {
      // Passwords match - login successful
      res.status(200).json({ message: 'Login successful' });
    } else {
      // Passwords don't match
      res.status(401).json({ error: 'Invalid password' });
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  getAllUsers,
  getUser,
  signup,
  signin,
};
