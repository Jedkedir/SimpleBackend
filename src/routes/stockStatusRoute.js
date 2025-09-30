const express = require('express');
const router = express.Router();
const stock = require('../controllers/stockStatusController');


router.get('/', stock.getStockData);

module.exports = router;