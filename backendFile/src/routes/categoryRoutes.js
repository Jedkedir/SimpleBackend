const express = require('express');
const router = express.Router();

const categoryController = require('../control/categoryControl')

router.get('/getCategory', categoryController.getCategory);
router.post('/addCategory', categoryController.addCategory);

module.exports = router;