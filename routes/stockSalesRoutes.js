const router = require('express').Router();

const {
  getAllStockSales,
  getStockSale,
  addStockItem,
} = require('../controllers/stockSalesController');

router.get('/get-sales', getAllStockSales);
router.get('/get-sales/:id', getStockSale);
router.post('/add-sale', addStockItem);

module.exports = router;
