
const express = require('express');
const router = express.Router();
const {
  registerController,
  loginController,
  addAdmin
} = require('../controllers/authController');


router.post('/register', registerController);

router.post('/login', loginController);

router.post('/addAdmin', addAdmin)

module.exports = router;

