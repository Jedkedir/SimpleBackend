const express = require('express');
const router = express.Router();

const userMangControl = require('../control/userMangControl');

router.get('/getUser', userMangControl.getUsers);
router.post('/deleteUser/:id', userMangControl.deleteUsers);
router.post('/addAdmin', userMangControl.addAdmins);
router.get('/getAdmins', userMangControl.getAdmins);

module.exports = router;