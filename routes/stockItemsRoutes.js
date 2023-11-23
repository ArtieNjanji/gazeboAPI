const router = require('express').Router();

const {
  getAllStockItems,
  getStockItemById,
  addStockItem,
  deleteStockItem,
  updateStockItem,
} = require('../controllers/stockItemsController');

router.get('/get-stock', getAllStockItems);
router.get('/get-stock/:id', getStockItemById);
router.post('/add-stock', addStockItem);
router.delete('/delete-stock/:id', deleteStockItem);
router.put('/update-stock/:id', updateStockItem);

module.exports = router;
