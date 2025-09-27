const express = require('express')
const router = express.Router();

const productController = require('../control/prodControl');

router.get('/getproducts', productController.getProducts);
router.post('/addProducts', productController.createProduct);

module.exports = router