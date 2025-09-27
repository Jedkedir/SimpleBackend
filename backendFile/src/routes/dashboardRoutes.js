const express = require('express')
const router = express.Router();

const dashboardController = require('../control/dashboardCon');

router.get('/topSelling', dashboardController.topSelling);
router.get('/totalSold', dashboardController.totalSold);
router.get('/totalRevenue', dashboardController.totalRevenue)
router.get('/stock', dashboardController.getStock);

module.exports = router