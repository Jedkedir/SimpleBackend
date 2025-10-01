const express = require("express");
const router = express.Router();

const {
    getProfileInfoController,
    getUserDetails
} = require('../controllers/profileController');

router.get('/userCredentials', getProfileInfoController);
router.get('/userData', getUserDetails)

module.exports = router;