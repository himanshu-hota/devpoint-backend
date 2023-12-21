const express = require('express');
const { registerValdator,loginValdator } = require('../util/Validators');  // Corrected path

const authController  = require('../controllers/authController');
const { verifyToken } = require('../util/verfiyToken');

const router = express.Router();

router.post('/register', registerValdator ,authController.register);

router.post('/login', loginValdator, authController.login);

router.post('/profile', verifyToken, authController.profile);

router.post('/logout', verifyToken, authController.logout);


module.exports = router;
