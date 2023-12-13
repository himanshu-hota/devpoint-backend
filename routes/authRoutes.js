const express = require('express');
const { registerValdator,loginValdator } = require('../util/Validators');  // Corrected path

const authController  = require('../controllers/authController');

const router = express.Router();

router.post('/register', registerValdator ,authController.register);

router.post('/login', loginValdator, authController.login);

router.get('/profile', authController.profile);

router.post('/logout', authController.logout);


module.exports = router;
