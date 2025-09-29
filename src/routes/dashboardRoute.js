const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');


router.get('/', dashboardController.getOrderNotification);
router.get('/', dashboardController.getTotalSoldData);
router.get('/', dashboardController.getTotalRevenueData)
router.get('/', dashboardController.getStokeNotificationMessage);

module.exports = router;