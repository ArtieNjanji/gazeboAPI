const router = require('express').Router();

const {
  getAllTransactions,
  getTransaction,
  addTransaction,
  getAllTransactionsToExcel,
} = require('../controllers/transactionsController');

router.get('/get-transactions', getAllTransactions);
router.get('/get-transaction/:id', getTransaction);
router.post('/add-transaction', addTransaction);
router.get('/generate-excel', getAllTransactionsToExcel);

module.exports = router;
