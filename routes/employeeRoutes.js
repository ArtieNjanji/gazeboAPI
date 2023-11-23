const router = require('express').Router();

const {
  getEmployees,
  getEmployee,
  addEmployee,
  updateEmployee,
  deleteEmployee,
} = require('../controllers/employeesController');

router.get('/get-employees', getEmployees);
router.get('/get-employee/:id', getEmployee);
router.post('/add-employee', addEmployee);
router.put('/update-employee/:id', updateEmployee);
router.delete('/delete-employee/:id', deleteEmployee);

module.exports = router;
